import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckOutPage = () => {
  const navigate = useNavigate();
  const {
    notDisCountPrice = 0,
    totalPrice = 0,
    totalQty = 0,
    fetchCartItems,
    fetchOrder,
    fetchAllOrder,
  } = useGlobalContext();

  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const cartItem = useSelector((state) => state?.cartItem?.cart || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enabledAddresses = addressList.filter((addr) => addr.status);

  const handleCashOnDelivery = async () => {
    if (
      selectedAddressIndex === null ||
      !enabledAddresses[selectedAddressIndex]
    ) {
      setError("Please select a delivery address");
      return;
    }

    const address = enabledAddresses[selectedAddressIndex];

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/order/cod",
        {
          list_items: cartItem,
          totalQty,
          // totalAmt: totalPrice,
          addressId: address._id,
          // subTotalAmt: totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        fetchCartItems();
        fetchOrder();
        fetchAllOrder();
        navigate("/success", { state: { text: "Order Successful" } });
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create order. Please try again."
      );
      navigate("/cancel", { state: { text: "Order Cancelled" } });
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (
      selectedAddressIndex === null ||
      !enabledAddresses[selectedAddressIndex]
    ) {
      setError("Please select a delivery address");
      return;
    }

    const address = enabledAddresses[selectedAddressIndex];

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      // Create modified cart items with only the first image
      const modifiedCartItems = cartItem.map((item) => ({
        ...item,
        productId: {
          ...item.productId,
          image: item.productId?.image?.[0] || "", // Use first image or empty string
        },
      }));

      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      // eslint-disable-next-line no-unused-vars
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await axios.post(
        "http://localhost:5000/api/order/onlinePayment",
        {
          list_items: modifiedCartItems, // Use modified items
          totalQty,
          totalAmt: totalPrice,
          addressId: address._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success && response.data.url) {
        fetchCartItems();
        fetchOrder();
        fetchAllOrder();
        window.location.href = response.data.url;
      } else {
        setError("Failed to redirect to payment.");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-blue-50 min-h-screen p-4">
      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        {/* Address Selection */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-xl font-semibold text-gray-700 mb-4">
            Choose Your Address
          </h1>
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            {enabledAddresses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No addresses found. Please add a delivery address.
              </p>
            ) : (
              enabledAddresses.map((address, index) => (
                <div
                  key={address._id}
                  className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all
                    ${
                      selectedAddressIndex === index
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:bg-blue-50"
                    }`}
                  onClick={() => setSelectedAddressIndex(index)}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="radio"
                      checked={selectedAddressIndex === index}
                      onChange={() => setSelectedAddressIndex(index)}
                      className="h-5 w-5 text-green-600 mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {address.address_line}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state}, {address.country} -{" "}
                        {address.pincode}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Phone: {address.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setOpenAddress(true)}
            className="w-full h-20 bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-500 hover:bg-blue-50 transition-colors"
          >
            <span className="text-lg">+</span>
            <span>Add New Address</span>
          </button>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/2">
          <h1 className="text-xl font-semibold text-gray-700 mb-4">
            Order Summary
          </h1>
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="font-semibold text-lg mb-3">Bill Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p>Items ({totalQty})</p>
                <p className="flex items-center gap-2">
                  {notDisCountPrice > totalPrice && (
                    <span className="line-through text-gray-400">
                      ₹{notDisCountPrice.toFixed(2)}
                    </span>
                  )}
                  <span>₹{totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <div className="flex justify-between">
                <p>Delivery Charge</p>
                <p className="text-green-600">Free</p>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total Amount</p>
                  <p>₹{totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleOnlinePayment}
                disabled={loading || cartItem.length === 0}
                className={`w-full py-3 px-4 rounded font-semibold transition-colors ${
                  loading || cartItem.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : "Pay Online"}
              </button>

              <button
                onClick={handleCashOnDelivery}
                disabled={loading || cartItem.length === 0}
                className={`w-full py-3 px-4 rounded font-semibold transition-colors ${
                  loading || cartItem.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loading ? "Placing Order..." : "Cash on Delivery"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
                {error.includes("Invalid string")
                  ? "Product image format error. Please contact support."
                  : error}
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-3">Your Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cartItem.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Your cart is empty
                </p>
              ) : (
                cartItem.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.productId?.image?.[0] || "/fallback.jpg"}
                        alt={item.productId?.name || "Product"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">
                        {item.productId?.name}
                      </p>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold">
                          ₹{(item.productId?.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {openAddress && (
        <AddAddress
          close={() => setOpenAddress(false)}
          onSuccess={() => {
            setOpenAddress(false);
            if (enabledAddresses.length === 0) {
              setSelectedAddressIndex(0);
            }
          }}
        />
      )}
    </section>
  );
};

export default CheckOutPage;

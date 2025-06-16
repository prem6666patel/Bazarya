import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [currentUpdateId, setCurrentUpdateId] = useState(null);
  const [error, setError] = useState(null);

  const { fetchAllOrder } = useGlobalContext();

  const token = localStorage.getItem("accessToken");

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELED", label: "Canceled" },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getAllOrders = useSelector((state) => state.allorders.allOrder);

  useEffect(() => {
    if (getAllOrders?.length > 0) {
      setOrders(getAllOrders);
    }
    setLoading(false);
  }, [getAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    setCurrentUpdateId(orderId);

    try {
      if (!token) throw new Error("Authentication token not found");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `https://bazarya-theta.vercel.app/api/order/update-status/${orderId}`,
        { delivery_status: newStatus },
        config
      );

      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, delivery_status: newStatus }
              : order
          )
        );
        fetchAllOrder();
      } else {
        setError(response.data.message || "Failed to update status");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
      console.log("handleStatusChange : ", error);
    } finally {
      setUpdating(false);
      setCurrentUpdateId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="m-0 h-screen overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 p-4 bg-white shadow-md z-10">
        <h1 className="font-semibold text-xl">Orders</h1>
      </div>

      <div className="p-4 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <h1 className="text-gray-500 text-lg">No Orders Found</h1>
          </div>
        ) : (
          <>
            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden md:block">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Delivery Address</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{order.orderId}</td>
                      <td className="py-3 px-4 flex items-center">
                        {order.producId?.image?.[0] ? (
                          <img
                            src={order.producId.image[0]}
                            alt="Product"
                            className="w-20 h-20 object-cover rounded mr-3"
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20" />
                        )}
                        <span className="truncate max-w-xs">
                          {order.product_detail?.name ||
                            order.producId?.name ||
                            "Product not available"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        ₹{" "}
                        {order.product_detail?.price ||
                          order.producId?.price?.toFixed(2) ||
                          "0.00"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {order.delivery_address ? (
                          <div>
                            {order.delivery_address.address_line},<br />
                            {order.delivery_address.city},{" "}
                            {order.delivery_address.state}
                            <br />
                            {order.delivery_address.country} -{" "}
                            {order.delivery_address.pincode}
                          </div>
                        ) : (
                          <span className="text-red-500">
                            Address not available
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <select
                            value={order.delivery_status}
                            onChange={(e) =>
                              handleStatusChange(order.orderId, e.target.value)
                            }
                            disabled={
                              updating && currentUpdateId === order.orderId
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium w-32 appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getStatusClass(
                              order.delivery_status
                            )} ${
                              updating && currentUpdateId === order.orderId
                                ? "opacity-70 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                          {updating && currentUpdateId === order.orderId && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-8">
                              <svg
                                className="animate-spin h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (visible on mobile) */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Order ID
                      </p>
                      <p className="text-sm font-semibold">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium">Price</p>
                      <p className="text-sm font-semibold">
                        ₹{" "}
                        {order.product_detail?.price ||
                          order.producId?.price?.toFixed(2) ||
                          "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    {order.producId?.image?.[0] ? (
                      <img
                        src={order.producId.image[0]}
                        alt="Product"
                        className="w-16 h-16 object-cover rounded mr-3"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Product
                      </p>
                      <p className="text-sm font-medium">
                        {order.product_detail?.name ||
                          order.producId?.name ||
                          "Product not available"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Delivery Address
                    </p>
                    {order.delivery_address ? (
                      <div className="text-sm">
                        <p>{order.delivery_address.address_line}</p>
                        <p>
                          {order.delivery_address.city},{" "}
                          {order.delivery_address.state}
                        </p>
                        <p>
                          {order.delivery_address.country} -{" "}
                          {order.delivery_address.pincode}
                        </p>
                      </div>
                    ) : (
                      <span className="text-red-500 text-sm">
                        Address not available
                      </span>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Status
                    </p>
                    <div className="relative">
                      <select
                        value={order.delivery_status}
                        onChange={(e) =>
                          handleStatusChange(order.orderId, e.target.value)
                        }
                        disabled={updating && currentUpdateId === order.orderId}
                        className={`px-3 py-2 rounded-lg text-sm font-medium w-full appearance-none focus:outline-none focus:ring-2 focus:ring-opacity-50 ${getStatusClass(
                          order.delivery_status
                        )} ${
                          updating && currentUpdateId === order.orderId
                            ? "opacity-70 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FaAngleDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      {updating && currentUpdateId === order.orderId && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-8">
                          <svg
                            className="animate-spin h-4 w-4 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Orders;

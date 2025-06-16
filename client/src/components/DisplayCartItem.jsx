import React from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { FaCaretRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddToCartButton from "./AddToCartButton";

const DisplayCartItem = ({ close }) => {
  const navigate = useNavigate();
  const {
    notDisCountPrice = 0,
    totalPrice = 0,
    totalQty = 0,
  } = useGlobalContext();
  const cartItem = useSelector((state) => state?.cartItem?.cart || []);
  const user = useSelector((state) => state?.user);

  const redirectToCheckOutPage = () => {
    if (cartItem.length === 0) return;

    if (user?._id) {
      navigate("/CheckOutPage");
      close?.();
    } else {
      navigate("/login");
    }
  };

  const savings = notDisCountPrice - totalPrice;

  const handleClose = () => {
    if (window.innerWidth <= 768) {
      navigate("/");
    } else {
      close?.();
    }
  };

  return (
    <section
      className="bg-black fixed top-0 bottom-0 right-0 left-0 bg-opacity-55 z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-sm min-h-screen ml-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-2 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold">Cart</h2>
          <button onClick={handleClose} aria-label="Close cart">
            <IoClose size={30} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto bg-blue-50">
          {/* Savings */}
          {savings > 0 && (
            <div className="flex justify-between bg-blue-400 text-blue-800 p-1 rounded m-2">
              <p>Your Total Savings</p>
              <p>₹{savings.toFixed(2)}</p>
            </div>
          )}

          {/* Cart Items with Scrollable Container */}
          <div className="rounded-lg p-4">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              <div className="grid gap-5">
                {cartItem.length > 0 ? (
                  cartItem.map((item) => (
                    <div
                      key={`${item?.productId?._id}-${item?.size || "nosize"}-${
                        item?.color || "nocolor"
                      }`}
                      className="flex w-full gap-4 border p-1"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={item?.productId?.image?.[0] || ""}
                          alt={item?.productId?.name || "Product image"}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "fallback-image-url.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 text-xs gap-2">
                        <p className="text-base line-clamp-2">
                          {item?.productId?.name}
                        </p>
                        <p className="font-semibold">
                          ₹{item?.productId?.price?.toFixed(2)}
                        </p>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                      <div>
                        <AddToCartButton
                          data={item?.productId}
                          variantData={{ size: item.size, color: item.color }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Cart is empty</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Section */}
        <div className="sticky bottom-0 bg-white border-t">
          {/* Bill Details */}
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill Details</h3>
            <div className="flex justify-between my-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                {notDisCountPrice > totalPrice && (
                  <span className="line-through text-neutral-400">
                    ₹{notDisCountPrice.toFixed(2)}
                  </span>
                )}
                <span>₹{totalPrice.toFixed(2)}</span>
              </p>
            </div>
            <div className="flex justify-between my-1">
              <p>Quantity total</p>
              <p>{totalQty}</p>
            </div>
            <div className="flex justify-between my-1">
              <p>Delivery Charge</p>
              <p>Free</p>
            </div>
            <div className="font-semibold flex justify-between my-1">
              <p>Grand total</p>
              <p>₹{totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-2">
            <div
              className={`p-2 flex justify-between rounded ${
                cartItem.length === 0
                  ? "bg-gray-400"
                  : "bg-green-800 text-white"
              }`}
            >
              <div>Total: ₹{totalPrice.toFixed(2)}</div>
              <button
                onClick={redirectToCheckOutPage}
                className="flex items-center gap-1"
                disabled={cartItem.length === 0}
                aria-label={
                  cartItem.length === 0
                    ? "Cart is empty"
                    : "Proceed to checkout"
                }
              >
                Proceed
                <FaCaretRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisplayCartItem;

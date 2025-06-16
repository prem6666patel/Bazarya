import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";

const AddToCartButton = ({ handleAddToCart, data }) => {
  const { deleteCartItem } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableInCart, setIsAvailableInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);

  useEffect(() => {
    const itemInCart = cartItem.find((item) => item.productId._id === data._id);
    setIsAvailableInCart(!!itemInCart);
    setCartItemId(itemInCart?._id || null);
  }, [cartItem, data]);

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItemId) {
      deleteCartItem(cartItemId);
    }
  };

  return (
    <div>
      {isAvailableInCart ? (
        <button
          onClick={handleRemove}
          className="p-1 rounded text-white bg-red-600 hover:bg-red-300 hover:text-black"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="p-1 rounded text-white bg-green-600 hover:bg-green-300 hover:text-black"
        >
          Add
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { valideUrlCovert } from "../utils/valideUrlConverter";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCartButton from "./AddToCartButton";

const CardProduct = ({ data }) => {
  const url = `/product/${valideUrlCovert(data.name)}-${data._id}`;
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const { fetchCartItems } = useGlobalContext();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.post(
        "https://bazarya-theta.vercel.app/api/cart/create", 
        { productId: data._id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchCartItems();
      toast.success("Added to cart!"); 
    } catch (error) {
      console.log("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-2 grid gap-3 w-56 rounded bg-white mt-2">
      
      <Link
        to={url}
        className="min-h-36 rounded overflow-hidden flex items-center justify-center bg-white"
      >
        <img
          src={data.image?.[0] || "/placeholder-image.jpg"}
          alt={data.name || "product"}
          className="h-36 w-48 object-scale-down scale-125"
        />
      </Link>

      {/* Product name */}
      <Link to={url} className="text-ellipsis line-clamp-2 hover:underline">
        {data.name}
      </Link>

      {/* Price and action button */}
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">
          ₹{data.price - (data.discount || 0)}
        </div>
        <div>
          {data.stock > 0 ? (
            // <button
            //   onClick={handleAddToCart}
            //   disabled={loading}
            //   className={`p-1 rounded text-white ${
            //     loading
            //       ? "bg-gray-400 cursor-not-allowed"
            //       : "bg-green-600 hover:bg-green-300 hover:text-black"
            //   }`}
            // >
            //   {loading ? "Adding..." : "Add"}
            // </button>
            <AddToCartButton data={data} handleAddToCart={handleAddToCart} />
          ) : (
            <span className="text-base text-red-600">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardProduct;

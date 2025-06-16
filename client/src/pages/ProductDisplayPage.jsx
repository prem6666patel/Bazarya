import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddToCartButton from "../components/AddToCartButton"; // adjust path as needed
import { useGlobalContext } from "../provider/GlobalProvider";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const { fetchCartItems } = useGlobalContext();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/product/getProductById",
          { productId }
        );

        const productData = response.data.data;
        setProduct(productData);
        setSelectedImage(productData?.image?.[0]);
      } catch (error) {
        console.log("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAddingToCart(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart/create",
        { productId: product._id },
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
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-red-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const originalPrice = product.price;
  const discountAmount = product.discount || 0;
  const discountedPrice = originalPrice - discountAmount;
  const hasDiscount = discountAmount > 0;

  return (
    <section className="container mx-auto p-2 grid lg:grid-cols-2 gap-10">
      {/* Left: Image Gallery */}
      <div>
        <div className="rounded-xl overflow-hidden lg:mt-10">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[400px] object-contain"
          />
        </div>
        <div className="flex gap-2 mt-4 items-center justify-center">
          {product.image?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`thumb-${index}`}
              onClick={() => setSelectedImage(img)}
              className={`w-16 h-16 lg:w-20 lg:h-20 object-cover border rounded cursor-pointer ${
                selectedImage === img ? "border-blue-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col gap-4 lg:mt-10">
        <h2 className="text-4xl font-bold">{product.name}</h2>
        <p className="text-gray-700 text-xl">{product.discription}</p>

        {/* Price Display */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {hasDiscount && (
              <span className="text-lg font-semibold text-green-700">
                ₹ {discountedPrice}
              </span>
            )}
            <span
              className={`text-lg font-semibold ${
                hasDiscount ? "line-through text-gray-500" : "text-green-700"
              }`}
            >
              ₹ {originalPrice}
            </span>
            {hasDiscount && (
              <span className="text-sm font-medium bg-red-100 text-red-700 px-2 py-1 rounded">
                Save ₹{discountAmount}
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-xs text-gray-500">
              Effective price after discount
            </span>
          )}
        </div>

        <div>
          <strong>Stock:</strong>{" "}
          <span
            className={product.stock > 0 ? "text-green-600" : "text-red-600"}
          >
            {product.stock > 0 ? product.stock + " Available" : "Out of Stock"}
          </span>
        </div>

        <div className="text-sm">
          <strong>Unit:</strong> {product.unit}
        </div>

        {product.stock > 0 && (
          <div>
            <AddToCartButton
              data={product}
              handleAddToCart={handleAddToCart}
              loading={addingToCart}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDisplayPage;

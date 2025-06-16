import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../components/Loading";
import { valideUrlCovert } from "../utils/valideUrlConverter";
import { useSelector } from "react-redux";
import AddToCartButton from "../components/AddToCartButton";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const ProductList = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchCartItems } = useGlobalContext();

  const subCategoryData =
    useSelector((state) => state.product.allsubCategory) || [];

  const categoryParam = params?.category;
  const subCategoryParam = params?.subCategory;

  const categoryId = categoryParam?.split("-").pop();
  const subCategoryId = subCategoryParam?.split("-").pop();

  const currentSubCategory = subCategoryData.find(
    (sub) => sub._id === subCategoryId
  );
  const currentCategorySubs = subCategoryData.filter(
    (sub) => sub.category?._id === categoryId
  );

  useEffect(() => {
    if (!categoryId || !subCategoryId) {
      setError("Invalid category or sub-category");
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://bazarya-theta.vercel.app/api/product/getProductByCategoryAndSubCategory",
          { categoryId, subCategoryId }
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [categoryId, subCategoryId]);

  const handleAddToCart = async (e, product) => {
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
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto py-8 text-center">
        <Loading />
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-8 text-center text-red-500">
        <p>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="sticky top-20">
      <div className="container mx-auto flex">
        {/* Sidebar */}
        <div className="md:block md:fixed md:w-[200px] lg:w-[250px] md:top-20 md:bottom-0 bg-white overflow-y-auto p-2 hide-scrollbar w-[150px] sticky top-28 z-10 ">
          {currentCategorySubs.map((s) => {
            const url = `/${valideUrlCovert(s?.category?.name)}-${
              s?.category?._id
            }/${valideUrlCovert(s?.name)}-${s?._id}`;
            return (
              <Link
                to={url}
                key={s._id}
                className={`w-full p-2 hover:bg-blue-200 block ${
                  subCategoryId === s._id ? "bg-blue-100" : ""
                }`}
              >
                <div className="w-full">
                  <p className="text-center lg:text-2xl mb-1">{s.name}</p>
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-scale-down"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main content */}
        <div className="w-full mt-1 md:ml-[200px] lg:ml-[251px]">
          <div className="bg-white shadow-md p-4 sticky top-20 z-10">
            <h3 className="font-semibold text-lg">
              {data[0]?.subCategory?.name || "Products"}
            </h3>
          </div>

          <div className="p-2 md:p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {data.map((product) => {
                const url = `/product/${valideUrlCovert(product.name)}-${
                  product._id
                }`;
                return (
                  <Link
                    to={url}
                    key={product._id}
                    className="border p-2 flex flex-col gap-2 rounded-lg bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                      <img
                        src={product.image[0]}
                        alt={product.name || "product"}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    <div className="flex-grow flex flex-col">
                      <div className="text-sm line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </div>
                      <div className="mt-auto pt-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">₹{product.price}</div>
                          <AddToCartButton
                            data={product}
                            handleAddToCart={(e) => handleAddToCart(e, product)}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductList;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import CardProduct from "../components/CardProduct";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get("q") || "";

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://bazarya-theta.vercel.app/api/product/getAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        const allProducts = response.data.data || [];

        // Filter based on query
        const filtered = allProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setData(filtered);
      }
    } catch (error) {
      console.error("fetchProductData:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [searchQuery]);

  return (
    <section>
      <div className="container mx-auto p-4">
        <p className="font-semibold">
          Search Results: {loading ? "Loading..." : data.length}
        </p>

        {!loading && data.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white rounded-lg overflow-hidden shadow animate-pulse"
                >
                  <div className="bg-gray-200 h-40 w-full" />
                  <div className="p-3">
                    <div className="bg-gray-200 h-5 w-3/4 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-4 w-full rounded"></div>
                  </div>
                </div>
              ))
            : data.map((p) => <CardProduct key={p._id} data={p} />)}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;

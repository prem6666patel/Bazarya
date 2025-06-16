import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ProductCartAdmin from "../components/ProductCartAdmin";

const ProductsAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // New state for filtered products
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  const fetchProductData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/product/getAll"
      );

      const { data: responseData } = response;

      if (responseData.success) {
        setProductData(responseData.data);
        setFilteredData(responseData.data); // Initialize filtered data
      }
    } catch (error) {
      console.error("fetchProductData:", error);
      toast.error("Error fetching product data");
    }
  };

  // Handle search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredData(productData);
    } else {
      const filtered = productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate pagination using filteredData
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <>
      <section className="m-0 h-screen overflow-y-auto scrollbar-hide">
        <div className="sticky top-0 p-2 bg-white shadow-md flex flex-col md:flex-row justify-between items-center mb-1 gap-2">
          <h1 className="font-semibold text-lg">Products</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="text-sm text-gray-600 whitespace-nowrap">
              Page {currentPage} of {totalPages || 1}
            </span>
          </div>
        </div>

        <div className="p-2 bg-blue-50">
          {currentItems.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {currentItems.map((p, index) => (
                  <ProductCartAdmin key={p._id || index} data={p} fetchProductData={fetchProductData} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center mt-2 space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Previous
                </button>

                {/* Page Number Buttons */}
                <div className="hidden sm:flex space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-10 h-8 rounded-md ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-gray-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-200 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              {searchTerm ? "No matching products found" : "No products found"}
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductsAdmin;

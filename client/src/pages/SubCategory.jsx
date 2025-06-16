import React, { useEffect, useState, useMemo } from "react";
import UploadSubCategory from "../components/UploadSubCategory";
import axios from "axios";
import { RiFileEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import DeleteBox from "../components/DeleteBox";
import { toast } from "react-hot-toast";
import EditSubCategory from "../components/EditSubCategory";

const SubCategory = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  
  const filteredData = useMemo(() => {
    return subCategoryData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subCategoryData, searchTerm]);

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchSubCategory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/subCategory/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubCategoryData(response.data.data);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, [openEdit, openAddSubCategory]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        "http://localhost:5000/api/subCategory/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id: deleteCategoryId },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setOpenConfirmBoxDelete(false);
        fetchSubCategory();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="m-0 h-screen overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 p-2 bg-white shadow-md flex flex-col md:flex-row justify-between mb-1 gap-2">
        <h1 className="font-semibold text-lg">Sub Category</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          
          <button
            onClick={() => setOpenAddSubCategory(true)}
            className="text-sm border hover:bg-slate-400 rounded-lg p-2 bg-slate-300 whitespace-nowrap"
          >
            Add SubCategory
          </button>
        </div>
      </div>

      {openAddSubCategory && (
        <UploadSubCategory
          close={() => {
            setOpenAddSubCategory(false);
            fetchSubCategory();
          }}
        />
      )}

      <div className="p-3 m-2">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border text-center">#</th>
              <th className="border text-center">Name</th>
              <th className="border text-center">Image</th>
              <th className="border text-center">Category</th>
              <th className="border text-center">Edit</th>
              <th className="border text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              // Calculate the actual index in the entire dataset
              const actualIndex = indexOfFirstItem + index;
              return (
                <tr key={item._id || actualIndex} className="hover:bg-gray-100">
                  <td className="border text-center">{actualIndex + 1}</td>
                  <td className="border text-center">{item.name}</td>
                  <td className="border text-center flex justify-center items-center p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-32 rounded object-scale-down"
                    />
                  </td>
                  <td className="border text-center">
                    {item.category?.name || "No Category"}
                  </td>
                  <td className="border text-center">
                    <div className="flex justify-center items-center hover:scale-150 hover:cursor-pointer">
                      <RiFileEditFill
                        size={30}
                        onClick={() => {
                          setSelectedCategory(item);
                          setOpenEdit(true);
                        }}
                      />
                    </div>
                  </td>
                  <td className="border">
                    <div className="flex justify-center items-center hover:scale-150 hover:cursor-pointer">
                      <MdDelete
                        size={30}
                        onClick={() => {
                          setOpenConfirmBoxDelete(true);
                          setDeleteCategoryId(item._id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
            </div>
            
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1 
                    ? "bg-gray-200 cursor-not-allowed" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages 
                    ? "bg-gray-200 cursor-not-allowed" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No results message */}
        {filteredData.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            {searchTerm ? "No matching subcategories found" : "No subcategories available"}
          </div>
        )}
      </div>
      
      {openConfirmBoxDelete && (
        <DeleteBox
          colse={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDelete}
        />
      )}
      {openEdit && (
        <EditSubCategory
          category={selectedCategory}
          close={() => {
            setOpenEdit(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </section>
  );
};

export default SubCategory;
import React, { useEffect, useState, useMemo } from "react";
import UploadCategory from "../components/UploadCategory";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import axios from "axios";
import EditCategory from "../components/EditCategory";
import DeleteBox from "../components/DeleteBox";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Category = () => {
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [CategoryData, setCategoryData] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return CategoryData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [CategoryData, searchTerm]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        "https://bazarya-theta.vercel.app/api/category/delete",
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
        fetchCategory();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const allCategory = useSelector((state) => state.product.allCategory);

  useEffect(() => {
    setCategoryData(allCategory);
  }, [allCategory]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://bazarya-theta.vercel.app/api/category/get"
      );
      if (response.data.success) {
        setCategoryData(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Category Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [openUpload, openEdit]);

  return (
    <section className="m-0 h-screen overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 p-2 bg-white shadow-md flex flex-col sm:flex-row justify-between mb-1 gap-2">
        <h1 className="font-semibold text-lg">Category</h1>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <button
            onClick={() => setOpenUpload(true)}
            className="text-sm border hover:bg-slate-400 rounded-lg p-2 bg-slate-300 whitespace-nowrap"
          >
            Add Category
          </button>
        </div>
      </div>

      {loading && <Loading />}
      {!loading && filteredCategories.length === 0 && (
        <NoData
          message={
            searchTerm
              ? "No matching categories found"
              : "No categories available"
          }
        />
      )}

      {!loading && filteredCategories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 m-3">
          {filteredCategories.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded p-4 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-32 object-cover rounded"
              />
              <p className="font-semibold">{item.name}</p>
              <div className="flex justify-between gap-14 mt-2">
                <button
                  onClick={() => {
                    setSelectedCategory(item);
                    setEditData(item);
                    setOpenEdit(true);
                  }}
                  className="border bg-green-300 p-1 rounded-full w-12 hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConfirmBoxDelete(true);
                    setDeleteCategoryId(item._id);
                  }}
                  className="border bg-red-300 p-1 rounded-full w-14 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openUpload && <UploadCategory close={() => setOpenUpload(false)} />}
      {openEdit && (
        <EditCategory
          data={editData}
          category={selectedCategory}
          close={() => {
            setOpenEdit(false);
            setSelectedCategory(null);
          }}
        />
      )}
      {openConfirmBoxDelete && (
        <DeleteBox
          colse={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDelete}
        />
      )}
    </section>
  );
};

export default Category;

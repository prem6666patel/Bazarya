import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import uploadImage from "../utils/UploadImage";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const EditSubCategory = ({ close, category }) => {
  const allCategories = useSelector((state) => state.product.allCategory);
  const [data, setData] = useState({
    id: category?._id || "",
    name: category?.name || "",
    image: category?.image || "",
    category: category?.category?._id || "", 
  });

  const [loading, setLoading] = useState(false);

  if (!category) return null;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      console.log("Uploaded Image URL:", imageUrl);

     
      if (imageUrl?.url) {
        setData((prev) => ({ ...prev, image: imageUrl.url }));
        toast.success("Image uploaded successfully");
      } else if (imageUrl?.imageUrl?.url) {
        setData((prev) => ({ ...prev, image: imageUrl.imageUrl.url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to get image URL");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

     
      const response = await axios.put(
        "https://bazarya-theta.vercel.app/api/subcategory/update",
        {
          id: data.id,
          name: data.name,
          image: data.image,
          category: data.category, // Parent category ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Subcategory updated successfully");
        close();
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-700 bg-opacity-60 p-4 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg p-4 rounded w-full">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg">Edit SubCategory</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoMdCloseCircle size={30} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="py-3 grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="name">SubCategory Name</label>
            <input
              type="text"
              placeholder="Enter name"
              name="name"
              value={data.name}
              id="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-40 w-40 flex items-center justify-center rounded overflow-hidden">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <p className="text-sm">No image</p>
                )}
              </div>

              <label htmlFor="uploadCategoryImage">
                <div className="bg-slate-500 hover:bg-slate-600 cursor-pointer p-2 rounded w-32 text-center text-white">
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadCategoryImage"
                  onChange={handleCategoryImage}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="parentCategory">Parent Category</label>
            <select
              name="category"
              value={data.category}
              onChange={handleOnChange}
              className="w-full p-2 bg-blue-50 outline-none rounded"
              required
              id="parentCategory"
            >
              <option value="">Select Category</option>
              {allCategories.map((cat) => (
                <option value={cat._id} key={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white p-2 rounded mt-4 transition-colors`}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;

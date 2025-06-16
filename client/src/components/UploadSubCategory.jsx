import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import uploadImage from "../utils/UploadImage";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const UploadSubCategory = ({ close }) => {
  const [SubCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: "", 
  });

  console.log(SubCategoryData);
  

  const handleSubCategory = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }
      
      // Create payload with only necessary data
      const payload = {
        name: SubCategoryData.name,
        image: SubCategoryData.image,
        category: SubCategoryData.category // Now sending single ID
      };

      const response = await axios.post(
        "http://localhost:5000/api/subCategory/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Subcategory added successfully");
        close();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting subcategory:", error);
      toast.error("Error adding subcategory");
    }
  };

  const allCategory = useSelector((state) => state.product.allCategory);

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl?.imageUrl?.url) {
        setSubCategoryData((prev) => ({
          ...prev,
          image: imageUrl.imageUrl.url,
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to get image URL");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="fixed top-0 left-0 bottom-0 right-0 z-50 bg-slate-800 bg-opacity-55 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white rounded p-3 m-5">
        <div className="flex justify-between">
          <h1 className="font-semibold">Add SubCategory</h1>
          <IoMdCloseCircle
            size={30}
            onClick={close}
            className="cursor-pointer"
          />
        </div>
        <form onSubmit={handleSubCategory} className="m-2 grid gap-5">
          <div className="grid">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={SubCategoryData.name}
              onChange={handleChange}
              className="p-1 bg-blue-50 border outline-none rounded"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image">Image</label>
            <div className="flex justify-start gap-2">
              <div className="border h-36 w-36 bg-blue-50 rounded flex items-center justify-center font-extralight">
                {!SubCategoryData.image ? (
                  <p>No image</p>
                ) : (
                  <img
                    src={SubCategoryData.image}
                    alt="Uploaded preview"
                    className="h-full w-full object-cover rounded"
                  />
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div className="flex items-center justify-center">
                  <div className="bg-slate-100 h-10 flex items-center justify-center rounded p-2 hover:bg-slate-300 cursor-pointer">
                    Upload
                  </div>
                  <input
                    type="file"
                    id="uploadSubCategoryImage"
                    className="hidden"
                    onChange={handleUploadSubCategoryImage}
                    required
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Selected Category */}
          <div className="grid gap-1">
            <label>Selected Category</label>
            {SubCategoryData.category && (
              <div className="border p-2 mb-2 flex justify-between items-center">
                <span>
                  {
                    allCategory.find(
                      (cat) => cat._id === SubCategoryData.category
                    )?.name
                  }
                </span>
                <IoClose
                  className="text-red-500 cursor-pointer"
                  onClick={() =>
                    setSubCategoryData((prev) => ({ ...prev, category: "" }))
                  }
                />
              </div>
            )}
          </div>

          {/* Category Selector */}
          <select
            name="category"
            value={SubCategoryData.category}
            onChange={handleChange}
            className="w-full p-1 bg-blue-50 outline-none rounded"
            required
          >
            <option value="">Select Category</option>
            {allCategory.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <button 
            type="submit"
            className="border rounded p-1 bg-green-300 hover:bg-green-700 hover:text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadSubCategory;
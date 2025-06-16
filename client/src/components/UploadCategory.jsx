import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import uploadImage from "../utils/UploadImage";
import axios from "axios";
import { toast } from "react-hot-toast";

const UploadCategory = ({ close }) => {
  const [data, setData] = useState({
    name: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      console.log("Uploaded Image URL:", imageUrl);

      if (imageUrl?.imageUrl?.url) {
        setData((prev) => ({
          ...prev,
          image: imageUrl.imageUrl.url,
        }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Failed to get image URL");
      }
    } catch (err) {
      console.log(err);

      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/category/add-category",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Category added successfully");
        close();
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-700 bg-opacity-60 p-4 flex items-center justify-center z-50">
      <div className="bg-white max-w-lg p-4 rounded w-full">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg">Add Category</h1>
          <button onClick={close} className="w-fit block ml-auto">
            <IoMdCloseCircle size={30} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="py-3 grid gap-3">
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              name="name"
              value={data.name}
              id="name"
              onChange={handleOnChange}
              className="bg-blue-50 p-2"
            />
          </div>

          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-40 w-40 flex items-center justify-center rounded">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="Uploaded preview"
                    className="h-full w-full object-cover rounded"
                  />
                ) : (
                  <p className="text-sm">No image</p>
                )}
              </div>

              <label htmlFor="uploadCategoryImage">
                <div
                  className={`${
                    !data.name
                      ? "bg-slate-300"
                      : "bg-slate-500 hover:bg-slate-600 cursor-pointer"
                  } p-2 rounded w-32 text-center text-white`}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadCategoryImage"
                  disabled={!data.name}
                  onChange={handleCategoryImage}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } text-white p-2 rounded mt-4`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadCategory;

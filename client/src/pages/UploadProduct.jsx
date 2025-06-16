import React, { useState, useRef } from "react";
import { FaCloudUploadAlt, FaTimes, FaSpinner } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import AddFieldComponent from "../components/AddFieldComponent";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: "",
    subCategory: "",
    unit: "",
    stock: "",
    price: "",
    discount: "",
    discription: "",
    more_details: {},
    publish: true,
  });

  console.log("data : ", data);

  const [openAddField, setOpenAddField] = useState(false);
  const [feildName, setfeildName] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const allsubCategory = useSelector((state) => state.product.allsubCategory);

  // In UploadProduct.js
  const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [feildName]: "", // Fixed: Add field inside more_details
        },
      };
    });
    setfeildName("");
    setOpenAddField(false);
  };

  // console.log("allSubCategory : ", allsubCategory);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - data.image.length;

    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more image`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files
        .slice(0, remainingSlots)
        .map(async (file) => {
          const imageUrl = await uploadImage(file);
          return imageUrl?.imageUrl?.url;
        });

      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url) => url !== undefined);

      setData((prev) => ({
        ...prev,
        image: [...prev.image, ...validUrls],
      }));

      if (validUrls.length > 0) {
        toast.success(`${validUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (data.image.length < 5 && !uploading) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index) => {
    setData((prev) => {
      const newImages = [...prev.image];
      newImages.splice(index, 1);
      return {
        ...prev,
        image: newImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (data.image.length < 5) {
        toast.error("Please upload exactly 5 images");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Submit to backend
      const response = await axios.post(
        "https://bazarya-theta.vercel.app/api/product/create",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product created successfully!");

        setData({
          name: "",
          image: [],
          category: "",
          subCategory: "",
          unit: "",
          price: "",
          stock: "",
          discount: "",
          discription: "",
          more_details: {},
          publish: true,
        });
      } else {
        toast.error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="m-0 h-screen overflow-y-auto scrollbar-hide">
        <div className="sticky top-0 p-2 bg-white shadow-md flex flex-col md:flex-row justify-between mb-1 gap-2">
          <h1 className="font-semibold text-lg">Upload Product</h1>
        </div>
        <div className="p-3">
          <form onSubmit={handleSubmit} className="gap-5">
            {/* Product Name Field */}
            <div className="grid gap-1 p-1">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter product name"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                className="bg-blue-50 p-1 pl-2 outline-none rounded-full"
                disabled={loading}
              />
            </div>

            {/* Description Field */}
            <div className="grid gap-1 p-1">
              <label htmlFor="discription">Description</label>
              <textarea
                placeholder="Enter product description"
                id="discription"
                name="discription"
                value={data.discription}
                onChange={handleChange}
                required
                className="bg-blue-50 p-1 pl-2 outline-none rounded-lg min-h-[100px]"
                disabled={loading}
              />
            </div>

            {/* Image Upload Section */}
            <div className="p-1">
              <p>
                Images{" "}
                {data.image.length < 5 && (
                  <span className="text-red-500 text-sm">
                    * (Required: {5 - data.image.length} more)
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {/* Display uploaded images */}
                {data.image.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`uploaded-${index}`}
                      className="w-24 h-24 object-cover border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      disabled={loading || uploading}
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}

                {/* Upload button - only show if less than 5 images */}
                {data.image.length < 5 && (
                  <div
                    onClick={triggerFileInput}
                    className={`h-24 w-24 border-2 border-dashed rounded-lg flex flex-col justify-center items-center ${
                      uploading || loading
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    }`}
                  >
                    {uploading ? (
                      <FaSpinner
                        className="animate-spin text-gray-500"
                        size={24}
                      />
                    ) : (
                      <>
                        <FaCloudUploadAlt size={24} className="text-gray-500" />
                        <p className="text-xs mt-1 text-gray-500">Upload</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploading || loading}
              />
            </div>

            <div className="grid gap-1 p-1">
              <label>Category</label>
              <select
                name="category"
                value={data.category}
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
            </div>

            <div className="grid gap-1 p-1">
              <label>SubCategory</label>
              <select
                name="subCategory"
                value={data.subCategory}
                onChange={handleChange}
                className="w-full p-1 bg-blue-50 outline-none rounded"
                required
              >
                <option value="">Select SubCategory</option>
                {allsubCategory.map((subcategory) => (
                  <option value={subcategory._id} key={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1 p-1">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                placeholder="Enter Product Unit"
                id="unit"
                name="unit"
                value={data.unit}
                onChange={handleChange}
                required
                className="bg-blue-50 p-1 pl-2 outline-none rounded-full"
                disabled={loading}
              />
            </div>

            <div className="grid gap-1 p-1">
              <label htmlFor="stock">stock</label>
              <input
                type="number"
                placeholder="Enter Product stock"
                id="stock"
                name="stock"
                value={data.stock}
                onChange={handleChange}
                required
                className="bg-blue-50 p-1 pl-2 outline-none rounded-full"
                disabled={loading}
              />
            </div>

            <div className="grid gap-1 p-1">
              <label htmlFor="stock">price</label>
              <input
                type="number"
                placeholder="Enter Product price"
                id="price"
                name="price"
                value={data.price}
                onChange={handleChange}
                required
                className="bg-blue-50 p-1 pl-2 outline-none rounded-full"
                disabled={loading}
              />
            </div>

            <div className="grid gap-1 p-1">
              <label htmlFor="stock">discount</label>
              <input
                type="number"
                placeholder="Enter Product discount"
                id="discount"
                name="discount"
                value={data.discount}
                onChange={handleChange}
                required
                className="bg-blue-50 p-1 pl-2 outline-none rounded-full"
                disabled={loading}
              />
            </div>

            <div className="gap-1 p-1 flex justify-start mt-2">
              <div
                onClick={() => setOpenAddField(true)}
                className="border rounded-full bg-blue-50 hover:bg-blue-600 hover:text-white p-2 cursor-pointer"
              >
                add Fields
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {Object.keys(data.more_details).map((k, index) => (
                <div key={index} className="grid gap-1">
                  <label htmlFor={k} className="capitalize">
                    {k}
                  </label>
                  <input
                    type="text"
                    id={k}
                    value={data.more_details[k] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setData((prev) => ({
                        ...prev,
                        more_details: {
                          ...prev.more_details,
                          [k]: value,
                        },
                      }));
                    }}
                    className="bg-blue-50 p-1 pl-2 outline-none rounded-full"
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  loading || uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Product...
                  </span>
                ) : (
                  "Create Product"
                )}
              </button>
            </div>
          </form>
        </div>
        {openAddField && (
          <AddFieldComponent
            value={feildName}
            onChange={(e) => setfeildName(e.target.value)}
            submit={handleAddField}
            close={() => {
              setOpenAddField(false);
            }}
          />
        )}
      </section>
    </div>
  );
};

export default UploadProduct;

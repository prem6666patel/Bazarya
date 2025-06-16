import React, { useState, useRef, useEffect } from "react";
import { FaCloudUploadAlt, FaTimes, FaSpinner, FaSave } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import AddFieldComponent from "../components/AddFieldComponent";

const EditProduct = ({ data: initialData, close, fetchProductData }) => {
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

  const [openAddField, setOpenAddField] = useState(false);
  const [feildName, setfeildName] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const allsubCategory = useSelector((state) => state.product.allsubCategory);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form with product data - FIXED CATEGORY/SUBCATEGORY ISSUE
  useEffect(() => {
    if (initialData) {
      // Extract category and subcategory IDs if they're objects
      const categoryId =
        initialData.category?._id || initialData.category || "";
      const subCategoryId =
        initialData.subCategory?._id || initialData.subCategory || "";

      setData({
        ...initialData,
        category: categoryId,
        subCategory: subCategoryId,
        image: initialData.image || [],
        more_details: initialData.more_details || {},
      });
    }
  }, [initialData]);

  const handleAddField = () => {
    setData((prev) => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [feildName]: "",
      },
    }));
    setfeildName("");
    setOpenAddField(false);
  };

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
      toast.error(`You can only upload ${remainingSlots} more image(s)`);
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
      if (data.image.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      // Update request with product ID
      const response = await axios.put(
        `http://localhost:5000/api/product/update/${initialData._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        close();
        fetchProductData();
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Product update error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const removeCustomField = (fieldName) => {
    setData((prev) => {
      const newDetails = { ...prev.more_details };
      delete newDetails[fieldName];
      return {
        ...prev,
        more_details: newDetails,
      };
    });
  };

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-slate-800 bg-opacity-55 z-50 flex items-start justify-center p-4 overflow-auto">
      <div className="bg-white w-full max-w-3xl shadow-xl rounded">
        <div className="sticky top-0 p-4 bg-white shadow-sm flex justify-between items-center rounded">
          <h1 className="font-semibold text-xl">Edit Product</h1>
          <button
            onClick={close}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name Field */}
            <div className="grid gap-1">
              <label htmlFor="name" className="font-medium">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                required
                className="bg-gray-50 p-2 pl-3 outline-none rounded-lg"
                disabled={loading}
              />
            </div>

            {/* Description Field */}
            <div className="grid gap-1">
              <label htmlFor="discription" className="font-medium">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                id="discription"
                name="discription"
                value={data.discription}
                onChange={handleChange}
                required
                className="bg-gray-50 p-2 pl-3 outline-none rounded-lg min-h-[100px]"
                disabled={loading}
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <p className="font-medium">
                Images
                {data.image.length < 5 && (
                  <span className="text-red-500 text-sm ml-2">
                    (You can add {5 - data.image.length} more)
                  </span>
                )}
              </p>

              <div className="flex flex-wrap gap-3 mt-2">
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

                {data.image.length < 5 && (
                  <div
                    onClick={triggerFileInput}
                    className={`h-24 w-24 border-2 border-dashed rounded-lg flex flex-col justify-center items-center ${
                      uploading || loading
                        ? "bg-gray-200 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
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

            {/* Category Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label className="font-medium">Category</label>
                <select
                  name="category"
                  value={data.category || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 outline-none rounded-lg"
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

              <div className="grid gap-1">
                <label className="font-medium">SubCategory</label>
                <select
                  name="subCategory"
                  value={data.subCategory || ""}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-50 outline-none rounded-lg"
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
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-1">
                <label htmlFor="unit" className="font-medium">
                  Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g., kg, pieces"
                  id="unit"
                  name="unit"
                  value={data.unit}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 p-2 pl-3 outline-none rounded-lg"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="stock" className="font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="Available quantity"
                  id="stock"
                  name="stock"
                  value={data.stock}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 p-2 pl-3 outline-none rounded-lg"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="price" className="font-medium">
                  Price ($)
                </label>
                <input
                  type="number"
                  placeholder="Product price"
                  id="price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 p-2 pl-3 outline-none rounded-lg"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="discount" className="font-medium">
                  Discount (%)
                </label>
                <input
                  type="number"
                  placeholder="Discount percentage"
                  id="discount"
                  name="discount"
                  value={data.discount}
                  onChange={handleChange}
                  className="bg-gray-50 p-2 pl-3 outline-none rounded-lg"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Custom Fields Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Additional Details</h3>
                <button
                  type="button"
                  onClick={() => setOpenAddField(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <span>+ Add Field</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {Object.entries(data.more_details).map(([key, value]) => (
                  <div key={key} className="grid gap-1">
                    <div className="flex justify-between">
                      <label className="capitalize font-medium">{key}</label>
                      <button
                        type="button"
                        onClick={() => removeCustomField(key)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={value || ""}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          more_details: {
                            ...prev.more_details,
                            [key]: e.target.value,
                          },
                        }));
                      }}
                      className="bg-gray-50 p-2 pl-3 outline-none rounded-lg"
                      disabled={loading}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={close}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
                  loading || uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FaSave className="mr-2" />
                    Update Product
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Add Field Modal */}
        {openAddField && (
          <AddFieldComponent
            value={feildName}
            onChange={(e) => setfeildName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </div>
    </div>
  );
};

export default EditProduct;

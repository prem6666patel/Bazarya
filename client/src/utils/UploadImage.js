import axios from "axios";

const uploadImage = async (image) => {
  try {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("image", image); // Ensure your backend expects "image" as the field name

    const response = await axios.post(
      "http://localhost:5000/api/file/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Upload success:", response.data);
    return response.data;
  } catch (error) {
    console.log("uploadImage error:", error.response?.data || error.message);
  }
};

export default uploadImage;

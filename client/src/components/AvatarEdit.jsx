import axios from "axios";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar } from "../store/userSlice";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";

const AvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.put(
        `http://localhost:5000/api/user/upload-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(updateAvatar(response.data.data.avatar));
      console.log("Upload successful:", response.data.data);
      toast.success("Upload successful");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-900 bg-opacity-55 p-10 flex items-center justify-center z-50">
      <div className="bg-white max-w-sm w-full rounded-lg p-6 flex flex-col items-center shadow-xl space-y-4">
        <button onClick={close} className="w-fit block ml-auto">
          <IoMdCloseCircle size={35} />
        </button>

        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden drop-shadow-md hover:scale-105 transition-transform duration-300">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUserCircle size={96} className="text-gray-500" />
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <label htmlFor="uploadProfile">
            <div className="cursor-pointer border p-2 rounded-full bg-slate-300 text-center hover:bg-slate-400 transition-colors duration-300">
              {loading ? "Uploading..." : "Upload"}
            </div>
          </label>
          <input
            type="file"
            id="uploadProfile"
            className="hidden"
            onChange={handleUploadAvatarImage}
            accept="image/*"
          />
        </form>
      </div>

      
    </section>
  );
};

export default AvatarEdit;

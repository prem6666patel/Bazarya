import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import AvatarEdit from "../components/AvatarEdit";
import axios from "axios";
import toast from "react-hot-toast";
import fetchUserDetails from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user);

  const [openProfileEdit, setProfile] = useState(false);
  const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("User not authenticated. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/user/update-user",
        { ...userData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        const userdata = await fetchUserDetails();
        dispatch(setUserDetails(userdata.data));
      } else {
        toast.error(responseData.message || "Update failed");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        toast.error(error.response.data.message || "Update failed");
      } else {
        console.error("Client/Network Error:", error);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
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

      <button
        onClick={() => setProfile(true)}
        className="text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-2 py-2 rounded-full transition-colors duration-300 shadow mt-3"
      >
        Change Profile
      </button>

      {openProfileEdit && <AvatarEdit close={() => setProfile(false)} />}

      <form onSubmit={handleSubmit} className="my-6 space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={userData.name}
            onChange={handleChange}
            className="w-full p-2 bg-blue-50 rounded outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 bg-blue-50 rounded outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block font-medium mb-1">
            Mobile
          </label>
          <input
            type="tel"
            name="mobile"
            pattern="[0-9]{10}"
            placeholder="Enter your mobile number"
            value={userData.mobile}
            onChange={handleChange}
            className="w-full p-2 bg-blue-50 rounded outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition-colors duration-300"
        >
          {loading ? "Updating..." : "Update Info"}
        </button>
      </form>
    </div>
  );
};

export default Profile;

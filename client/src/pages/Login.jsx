import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://bazarya-theta.vercel.app/api/user/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      if (response.data.success) {
        console.log("response : ", response);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userdata = await fetchUserDetails();
        dispatch(setUserDetails(userdata.data));

        toast.success("Login successful!");
        navigate("/"); // Redirect after login
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="w-full container mx-auto px-3">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Login to BinkeyIT</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>
          <div className="grid">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="bg-blue-50 p-2 rounded"
              required
            />
            <Link
              to="/forgot-password"
              className="text-right text-sm text-blue-600 hover:text-blue-800 mt-1"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

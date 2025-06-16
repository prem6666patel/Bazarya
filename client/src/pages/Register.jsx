import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Password and confirmPassword do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://bazarya-theta.vercel.app/api/user/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full container mx-auto px-3">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Welcome to BinkeyIT</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>
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
          </div>
          <div className="grid">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://bazarya-theta.vercel.app/api/user/forgot-password",
        {
          email,
        }
      );

      if (response.data.success) {
        toast.success("otp sent to your email!");
        setEmail("");
        navigate("/OTPVerify");
      } else {
        toast.error(response.data.message || "Failed to send otp.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Forgot Password Error:", error);
    }
  };

  return (
    <div className="w-full container mx-auto px-3">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid">
            <label htmlFor="email">Enter your registered email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Send otp
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

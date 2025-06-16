import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const OTPVerify = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/verify-forgot-password-otp",
        { email, otp }
      );

      if (res.data.success) {
        toast.success("OTP Verified!");
        navigate("/ResetPassword");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("OTP verification failed");
      console.error(error);
    }
  };

  return (
    <div className="w-full container mx-auto px-3">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">OTP Verification</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>
          <div className="grid">
            <label htmlFor="otp">Enter OTP sent to your email:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-blue-50 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;

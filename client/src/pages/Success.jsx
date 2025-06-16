import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.text || "Payment Successful";

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-700 mb-2">{message}</h2>
        <p className="text-gray-600 mb-6">Thank you for your action!</p>
        <button
          onClick={handleGoHome}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-all duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;

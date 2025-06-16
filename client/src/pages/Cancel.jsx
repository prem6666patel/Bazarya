import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const Cancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.text || "Order Cancelled";

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">{message}</h2>
        <p className="text-gray-600 mb-6">
          It seems your order was not completed.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-all duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;

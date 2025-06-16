import React from "react";

const CardLoading = () => {
  return (
    <div className="border p-3 grid gap-3 max-w-96 rounded animate-pulse">
      <div className="min-h-28 bg-blue-50 rounded"></div>
      <div className="p-5 bg-blue-50 rounded w-20"></div>
      <div className="p-5 bg-blue-50 rounded   "></div>
      <div className="p-5 bg-blue-50 rounded w-20"></div>

      <div className="flex items-center justify-between gap-3">
        <div className="p-5 bg-blue-50 rounded w-20"></div>
        <div className="p-5 bg-blue-50 rounded w-20"></div>
      </div>
    </div>
  );
};

export default CardLoading;

import React from "react";
import { IoCloseCircle } from "react-icons/io5";

const DeleteBox = ({ cancel, confirm }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg m-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Permanent Delete
          </h1>
          <IoCloseCircle
            size={30}
            className="text-red-500 cursor-pointer hover:scale-105 transition-transform"
            onClick={cancel}
          />
        </div>
        <p className="text-gray-700 mb-6">
          Are you sure you want to permanently delete this item?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={cancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBox;

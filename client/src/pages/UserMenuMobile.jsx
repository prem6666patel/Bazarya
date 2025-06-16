import React from "react";
import UserMenu from "../components/UserMenu";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const UserMenuMobile = () => {
  const navigate = useNavigate();

  const BackTohome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Close Button */}
      <div className="flex justify-end p-6">
        <button
          onClick={BackTohome}
          className="text-gray-600 hover:text-red-500 transition duration-200"
        >
          <AiFillCloseCircle size={30} />
        </button>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-2">
        <UserMenu />
      </div>
    </div>
  );
};

export default UserMenuMobile;

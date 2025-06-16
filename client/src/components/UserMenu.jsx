import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import axios from "axios";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "react-icons/fa";
import isAdmin from "../utils/isAdmin";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import { RiFolderUploadFill } from "react-icons/ri";
import { FaThList } from "react-icons/fa";
import { ImCart } from "react-icons/im";
import { FaAddressBook } from "react-icons/fa6";
import { FaMoneyBillWave } from "react-icons/fa6";
import { handleAddItemCart } from "../store/cartProduct";
import { MdBorderColor } from "react-icons/md";

const UserMenu = ({ handleCloseUserMenu }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/user/logout",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (handleCloseUserMenu) {
          handleCloseUserMenu();
        }
        dispatch(logout());
        dispatch(handleAddItemCart([]));
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log("logout error: ", error);
      toast.error("Error during logout");
    }
  };

  const handleClose = () => {
    if (handleCloseUserMenu) {
      handleCloseUserMenu();
    }
  };

  return (
    <>
      <div className="flex justify-between m-1">
        <div className="font-semibold">My Account</div>
        <div>
          {isAdmin(user.role) && (
            <button className="border mr-3 rounded bg-slate-100 hover:bg-slate-200">
              {" "}
              Admin
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {user?.name || user?.mobile}

        <Link onClick={handleClose} to={"/dashboard/profile"}>
          <FaExternalLinkAlt className="hover:bg-purple-200 mx-1" size={20} />
        </Link>
      </div>
      <Divider />

      <div className="text-semibold grid gap-3 mt-3 ">
        {isAdmin(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/Category"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <BiSolidCategoryAlt size={30} /> Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/subCategory"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <MdCategory size={30} /> Sub Category
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/uploadProduct"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <RiFolderUploadFill size={30} /> Upload Product
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/products"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <FaThList size={30}> </FaThList> Products
            </Link>
             <Link
              onClick={handleClose}
              to="/dashboard/orders"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <MdBorderColor size={30}> </MdBorderColor> Orders
            </Link>
          </>
        )}

        {!isAdmin(user.role) && (
          <>
            <Link
              onClick={handleClose}
              to="/dashboard/myorders"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <FaMoneyBillWave size={30} /> My Orders
            </Link>
            <Link
              onClick={handleClose}
              to="/cart"
              className="block md:hidden hover:bg-blue-50 p-1 rounded-full flex gap-2 items-center"
            >
              <ImCart size={30} /> My Cart
            </Link>
            <Link
              onClick={handleClose}
              to="/dashboard/address"
              className="hover:bg-blue-50 p-1 rounded-full flex  gap-2 items-center"
            >
              <FaAddressBook size={30} /> Save Address
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-300 p-1 rounded text-center hover:bg-red-500 mr-5"
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default UserMenu;

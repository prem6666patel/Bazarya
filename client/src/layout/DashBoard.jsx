import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const DashBoard = () => {

  const user = useSelector(state => state.user);

  console.log("user in dashbord : ",user);
  
  return (
    <div className="bg-white">
      <div className="container mx-auto p-4 grid lg:grid-cols-[250px,1fr]">
        {/* left part for menu */}
        <div className="py-4 top-32 max-h-[calc(100vh-210px)] sticky overflow-y-auto hidden lg:block border-r">
          <UserMenu />
        </div>

        {/* rigth part for content */}

        <div className="bg-white min-h-[76vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

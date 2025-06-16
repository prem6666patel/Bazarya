import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { CiLinkedin } from "react-icons/ci";

const Footer = () => {
  return (
    <div className="border-t">
      <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-3">
        <p>© All rights Reserved 2025</p>
        <div className="flex items-center gap-5 justify-center text-2xl">
          <a className="hover:text-primary-light">
            <FaFacebook />
          </a>
          <a className="hover:text-primary-light">
            <FaInstagram />
          </a>
          <a className="hover:text-primary-light">
            <CiLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

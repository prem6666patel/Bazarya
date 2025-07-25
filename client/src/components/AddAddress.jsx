import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast"; // for user notifications
import { useGlobalContext } from "../provider/GlobalProvider";

const AddAddress = ({ close }) => {
  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
  });

  const { fetchAddress } = useGlobalContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }
      // http://localhost:5000/api/category/update
      const res = await axios.post(
        "https://bazarya-theta.vercel.app/api/address/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Address added successfully!");
        fetchAddress();
        close(); // close modal on success
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    }
  };

  return (
    <section className="bg-black fixed inset-0 z-50 bg-opacity-55 flex justify-center items-start lg:items-center overflow-y-auto pt-10 lg:pt-0">
      <div className="bg-white p-4 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[40%] rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Add Address</h1>
          <IoClose
            onClick={close}
            size={28}
            className="hover:cursor-pointer text-gray-600 hover:text-black"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-4 text-sm">
          {[
            { label: "Address Line", name: "address_line" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "Pincode", name: "pincode" },
            { label: "Country", name: "country" },
            { label: "Mobile No.", name: "mobile" },
          ].map(({ label, name }) => (
            <div key={name} className="grid gap-1">
              <label htmlFor={name} className="font-medium">
                {label} :
              </label>
              <input
                type="text"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="border bg-blue-50 p-2 rounded outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="py-2 mt-2 w-full bg-yellow-400 hover:bg-yellow-500 font-semibold rounded text-center"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;

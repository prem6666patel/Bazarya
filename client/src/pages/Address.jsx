import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete, MdOutlineEditLocation } from "react-icons/md";
import DeleteBox from "../components/DeleteBox";
import EditAddress from "../components/EditAddress";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const [openAddress, setOpenAddress] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const addressList = useSelector((state) => state.addresses.addressList);
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      const res = await axios.delete(
        "https://bazarya-theta.vercel.app/api/address/disable",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            _id: deleteId,
          },
        }
      );

      if (res.data.success) {
        toast.success("Address disabled successfully!");
        fetchAddress();
        setOpenDelete(false); // close modal
      } else {
        toast.error(res.data.message || "Failed to disable address");
      }
    } catch (error) {
      console.log("handleDisableAddress error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-blue-100 mb-2">
      {/* Header */}
      <div className="sticky top-0 p-2 bg-white shadow-md flex flex-col sm:flex-row justify-between mb-1 gap-2">
        <h1 className="font-semibold text-lg">Saved Address</h1>
        <button
          onClick={() => setOpenAddress(true)}
          className="bg-blue-50 p-2 hover:bg-blue-100 rounded-full"
        >
          Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="p-1 bg-blue-100">
        {addressList.map((address, index) => (
          <div
            key={index}
            className={`bg-white border p-4 m-3 gap-5 hover:bg-blue-50 flex justify-between ${
              !address.status && "hidden"
            }`}
          >
            <div>
              <p>{address.address_line},</p>
              <p>{address.city},</p>
              <p>{address.state},</p>
              <p>
                {address.country} - {address.pincode}
              </p>
              <p>{address.mobile}</p>
            </div>
            <div className="grid gap-14">
              <MdDelete
                size={30}
                className="cursor-pointer"
                onClick={() => {
                  setDeleteId(address._id);
                  setOpenDelete(true);
                }}
              />
              <MdOutlineEditLocation
                size={30}
                className="cursor-pointer"
                onClick={() => {
                  setEditData(address);
                  setOpenEdit(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {/* Delete Confirmation Modal */}
      {openDelete && (
        <DeleteBox
          cancel={() => setOpenDelete(false)}
          confirm={handleDisableAddress}
        />
      )}

      {/* Edit Address Modal */}
      {openEdit && (
        <EditAddress close={() => setOpenEdit(false)} data={editData} />
      )}
    </div>
  );
};

export default Address;

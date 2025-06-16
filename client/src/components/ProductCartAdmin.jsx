import React, { useState } from "react";
import EditProduct from "./EditProduct";
import DeleteBox from "./DeleteBox";
import toast from "react-hot-toast";

const ProductCartAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:5000/api/product/delete/${data._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Delete failed:", result.message);
        if (result.message === "Product not found") {
          toast.error("Product not found. It may have already been deleted.");
        }
        return;
      }

      // Success case
      setOpenDelete(false);
      fetchProductData(); // Refresh product list
      console.log("Product deleted successfully:", result.message);
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="w-40 border bg-white p-1">
      <div>
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 p-1">Name : {data?.name}</p>
      <div className="flex justify-between gap-14 mt-2 mb-2">
        <button
          onClick={() => setEditOpen(true)}
          className="border bg-green-300 p-1 rounded-full w-12 hover:bg-green-600"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="border bg-red-300 p-1 rounded-full w-14 hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      {editOpen && (
        <EditProduct
          data={data}
          close={() => setEditOpen(false)}
          fetchProductData={fetchProductData}
        />
      )}
      {openDelete && (
        <DeleteBox
          cancel={() => setOpenDelete(false)}
          confirm={handleDelete}
          close={() => setOpenDelete(false)}
        />
      )}
    </div>
  );
};

export default ProductCartAdmin;

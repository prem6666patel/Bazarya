import React from "react";
import { useSelector } from "react-redux";

const MyOrders = () => {
  const order = useSelector((state) => state.orders.order);
  console.log("order : ", order);

  return (
    <div>
      <div className="bg-white shadow-md p-3 font-semibold">
        <h1>Order</h1>
      </div>
      {!order[0] && <h1>No Orders </h1>}
      {order.map((order, index) => {
        return (
          <div
            key={order._id + index + "order"}
            className="order rounded p-4 text-sm"
          >
            <p>Order No : {order?.orderId}</p>
            <div className="flex gap-3">
              <img src={order.product_detail.image[0]} className="w-14 h-14" />
              <div>
                <p className="font-medium">{order.product_detail.name}</p>
                <p className="font-medium">{order.totalAmt} ₹</p>
                <p className="font-medium">
                  payment status : {order.payment_status}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: [true, "provide orderId"],
      unique: true,
    },
    producId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    product_detail: {
      name: String,
      image: Array,
      price: String,
    },
    payment_status: {
      type: String,
      default: "",
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    delivery_status: {
      type: String,
      enum: ["PENDING", "DELIVERED", "CANCELED"],
      default: "PENDING",
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;

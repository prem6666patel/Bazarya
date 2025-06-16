import cartProductModel from "../models/cartproduct.model.js";
import orderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import Stripe from "../stripe.js";
import productModel from "../models/product.model.js";

export const codController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, addressId } = req.body;

    const payload = list_items.map((el) => ({
      userId: userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      producId: el.productId._id,
      product_detail: {
        name: el.productId.name,
        image: el.productId.image,
        price: el.productId.price,
      },
      paymentId: "",
      payment_status: "COD",
      delivery_address: addressId,
    }));

    const generatedOrder = await orderModel.insertMany(payload);

    await cartProductModel.deleteMany({ userId: userId });

    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    return res.status(200).json({
      message: "Order placed successfully using COD",
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    console.error("cashPaymentController Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const onlinePaymentController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, addressId, totalQty, totalAmt } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const payload = list_items.map((el) => ({
      userId: userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      producId: el.productId._id,
      product_detail: {
        name: el.productId.name,
        image: el.productId.image,
      },
      paymentId: "",
      payment_status: "ONLINE",
      delivery_address: addressId,
    }));

    const generatedOrder = await orderModel.insertMany(payload);

    await cartProductModel.deleteMany({ userId: userId });

    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    const line_items = list_items.map((item) => ({
      price_data: {
        currency: "INR",
        product_data: {
          name: item.productId.name,
          images: Array.isArray(item.productId.image)
            ? item.productId.image
            : [item.productId.image || ""],
          metadata: {
            productId: item.productId._id.toString(),
          },
        },
        unit_amount: (item.productId.price - item.productId.discount) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      metadata: {
        userId,
        addressId,
      },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.status(200).json({
      url: session.url,
      success: true,
    });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.userId;
    const orderList = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    if (!orderList.length) {
      return res.status(200).json({
        message: "No orders found for this user",
        data: [],
        success: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orderList,
    });
  } catch (error) {
    console.error("getOrderDetailsController Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const getAllOrderDetailsController = async (req, res) => {
  try {
    const getOrders = await orderModel
      .find()
      .populate("delivery_address")
      .populate("userId")
      .populate("producId")
      .sort({ createdAt: -1 });

    if (!getOrders || getOrders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
        success: false,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Orders retrieved successfully",
      success: true,
      count: getOrders.length,
      data: getOrders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { delivery_status } = req.body;

    // Validate status
    if (!["PENDING", "DELIVERED", "CANCELED"].includes(delivery_status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Must be PENDING, DELIVERED or CANCELED",
      });
    }

    // Find current order to get previous status
    const currentOrder = await orderModel.findOne({ orderId });
    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus = currentOrder.delivery_status;
    const productId = currentOrder.producId;

    // Update order status
    const updatedOrder = await orderModel
      .findOneAndUpdate(
        { orderId },
        { delivery_status },
        { new: true, runValidators: true }
      )
      .populate("delivery_address")
      .populate("userId")
      .populate("producId");

    // Handle stock changes only if status changed
    if (previousStatus !== delivery_status) {
      // Case 1: Changing to DELIVERED from non-DELIVERED
      if (delivery_status === "DELIVERED" && previousStatus !== "DELIVERED") {
        await productModel.findByIdAndUpdate(
          productId,
          { $inc: { stock: -1 } },
          { runValidators: true }
        );
      }
      // Case 2: Changing from DELIVERED to non-DELIVERED
      else if (
        previousStatus === "DELIVERED" &&
        delivery_status !== "DELIVERED"
      ) {
        await productModel.findByIdAndUpdate(
          productId,
          { $inc: { stock: 1 } },
          { runValidators: true }
        );
      }
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("updateOrderStatusController Error:", error);

    // Handle specific errors
    let statusCode = 500;
    let errorMessage = error.message || "Internal server error";

    if (error.name === "ValidationError") {
      statusCode = 400;
      errorMessage = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    } else if (error.name === "CastError") {
      statusCode = 400;
      errorMessage = "Invalid ID format";
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};

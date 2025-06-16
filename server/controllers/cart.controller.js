import cartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    const checkItem = await cartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItem) {
      return res.status(400).json({
        message: "item alredy in the cart",
      });
    }

    const cartItem = new cartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const savedCartItem = await cartItem.save();

    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: savedCartItem._id } }
    );

    return res.status(200).json({
      data: savedCartItem,
      message: "Item added successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const getCartItemController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is missing",
        success: false,
        error: true,
      });
    }

    const cartItems = await cartProductModel
      .find({ userId })
      .populate("productId");

    return res.json({
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const updateCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, qty } = req.body;

    if (!_id || !qty) {
      return res.status(400).json({
        message: "provide _id and qty",
      });
    }

    const updateCartItem = await cartProductModel.updateOne(
      {
        _id: _id,
      },
      {
        quantity: qty,
      }
    );

    return res.json({
      message: "item added",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const deleteCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Please provide cart item _id",
        success: false,
        error: true,
      });
    }

    const deletedItem = await cartProductModel.deleteOne({ _id: _id, userId });

    if (deletedItem.deletedCount === 0) {
      return res.status(404).json({
        message: "Cart item not found or already deleted",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Cart item deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

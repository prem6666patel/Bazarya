import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        success: false,
        error: true,
      });
    }

    const { address_line, city, state, pincode, country, mobile } = req.body;

    if (!address_line || !city || !state || !pincode || !country || !mobile) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const newAddress = new AddressModel({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId: userId,
    });

    const savedAddress = await newAddress.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { address_details: savedAddress._id },
    });

    return res.status(201).json({
      message: "Address added successfully",
      success: true,
      error: false,
      data: savedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const getAddressController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        success: false,
        error: true,
      });
    }

    const addresses = await AddressModel.find({ userId });

    return res.status(200).json({
      message: "Addresses fetched successfully",
      data: addresses,
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

export const updateAddressController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        success: false,
        error: true,
      });
    }

    const { _id, address_line, city, state, pincode, country, mobile } =
      req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Address ID is required",
        success: false,
        error: true,
      });
    }

    const existingAddress = await AddressModel.findOne({ _id, userId });
    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found or does not belong to user",
        success: false,
        error: true,
      });
    }

    const result = await AddressModel.updateOne(
      { _id },
      {
        $set: {
          address_line,
          city,
          state,
          pincode,
          country,
          mobile,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        message: "No changes made to the address",
        success: true,
        error: false,
      });
    }

    return res.status(200).json({
      message: "Address updated successfully",
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

export const deleteAddressController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID missing",
        success: false,
        error: true,
      });
    }

    if (!_id) {
      return res.status(400).json({
        message: "Address ID is required",
        success: false,
        error: true,
      });
    }

    const disableAddress = await AddressModel.updateOne(
      { _id, userId },
      { $set: { status: false } }
    );

    if (disableAddress.matchedCount === 0) {
      return res.status(404).json({
        message: "Address not found or does not belong to user",
        success: false,
        error: true,
      });
    }

    if (disableAddress.modifiedCount === 0) {
      return res.status(200).json({
        message: "Address already disabled",
        success: true,
        error: false,
      });
    }

    return res.status(200).json({
      message: "Address deleted (disabled) successfully",
      success: true,
      error: false,
      data: disableAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

import subCategoryModel from "../models/subCategory.model.js";

export const AddSubCategory = async (req, res) => {
  try {
    const { name, image, category } = req.body;
    if (!name || !image || !category) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        error: true,
      });
    }

    const newSubCategory = new subCategoryModel({
      name,
      image,
      category,
    });

    const savedSubCategory = await newSubCategory.save();

    return res.status(201).json({
      message: "Subcategory added successfully",
      success: true,
      error: false,
      data: savedSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const getSubCategory = async (req, res) => {
  try {
    const data = await subCategoryModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("category", "name"); 

    console.log("data at getSubCategory : ", data);

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "No subcategories found",
        data: [],
        error: false,
        success: true,
      });
    }

    return res.status(200).json({
      message: "Subcategory data retrieved successfully",
      data: data,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "SubCategory ID is required",
        success: false,
        error: true,
      });
    }

    const deletedSubCategory = await subCategoryModel.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res.status(404).json({
        message: "SubCategory not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "SubCategory deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("deleteSubCategory Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid SubCategory ID format",
        success: false,
        error: true,
      });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id, name, image, category } = req.body;

    if (!id || !name || !image || !category) {
      return res.status(400).json({
        message: "All fields (id, name, image) are required",
        success: false,
      });
    }

    const existingCategory = await subCategoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    const result = await subCategoryModel.updateOne(
      { _id: id },
      { name, image, category }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "No changes were made",
        success: false,
      });
    }

    return res.status(200).json({
      message: "SubCategory updated successfully",
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

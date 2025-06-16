import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import subCategoryModel from "../models/subCategory.model.js";

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    const newCategory = new categoryModel({ name, image });
    const savedCategory = await newCategory.save();

    if (!savedCategory) {
      return res.status(500).json({
        message: "Failed to save category",
        error: true,
        success: false,
      });
    }

    // Success
    return res.status(201).json({
      message: "Category added successfully",
      data: savedCategory,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("AddCategoryController Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const getCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find();

    return res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("getCategoryController Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { id, name, image } = req.body;

    if (!id || !name || !image) {
      return res.status(400).json({
        message: "All fields (id, name, image) are required",
        success: false,
      });
    }

    const existingCategory = await categoryModel.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    const result = await categoryModel.updateOne({ _id: id }, { name, image });

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "No changes were made",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("updateCategoryController Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
        success: false,
      });
    }

    const subCategoryCount = await subCategoryModel.countDocuments({
      category: id,
    });

    const productCount = await productModel.countDocuments({
      category: id,
    });

    if (subCategoryCount > 0 || productCount > 0) {
      return res.status(400).json({
        message:
          "Category is in use by subcategories or products. Cannot delete.",
        success: false,
      });
    }

    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("deleteCategoryController Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

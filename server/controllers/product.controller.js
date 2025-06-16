// controllers/product.controller.js
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      discription,
      more_details,
      publish,
    } = req.body;

    // Validate required fields
    if (!name || !category || !subCategory || !unit || !price) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Name, category, subcategory, unit, and price are required",
      });
    }

    // Validate image count (should be 5 as per frontend)
    if (!image || image.length !== 5) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Exactly 5 images are required",
      });
    }

    // Validate ObjectID format
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid category ID format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(subCategory)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid subcategory ID format",
      });
    }

    // Create new product instance
    const newProduct = new productModel({
      name,
      image,
      category, // Single ObjectId
      subCategory, // Single ObjectId
      unit,
      stock: stock || 0,
      price,
      discount: discount || null,
      discription: discription || "",
      more_details: more_details || {},
      publish: publish !== false, // Default to true if not provided
    });

    // Save to database
    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      error: false,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Product creation error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product name must be unique",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: true,
        message: messages.join(", "),
      });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    const { page, limit, search } = req.body;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    const qurey = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      productModel.find(qurey).sort({ createdAt: -1 }).skip(skip).limit(limit),
      productModel.countDocuments(qurey),
    ]);

    return res.json({
      message: "product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};

export const getAllProductController = async (req, res) => {
  try {
    const data = await productModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("category", "name")
      .populate("subCategory", "name");

    console.log("data at getAllProductController  : ", data);

    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "No subcategories found",
        data: [],
        error: false,
        success: true,
      });
    }

    return res.status(200).json({
      message: "product data retrieved successfully",
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

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
        error: true,
        success: false,
      });
    }

    const products = await productModel
      .find({ category: id })
      .lean()
      .populate("category", "name");

    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for this category",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      data: products,
      message: "Products retrieved successfully",
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

export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.body;

    // 1. Fix validation condition and error message
    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Category ID and sub Category ID are required", // Fixed typo and grammar
        error: true,
        success: false,
      });
    }

    // 2. Fix query syntax and add await
    const data = await productModel
      .find({
        category: categoryId, // Correct object syntax
        subCategory: subCategoryId,
      })
      .populate("category", "name")
      .populate("subCategory", "name");

    // 3. Add response for successful query
    return res.status(200).json({
      data: data,
      message: "Products fetched successfully",
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

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product ID format",
        error: true,
        success: false,
      });
    }

    const product = await productModel
      .findById(productId)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      data: product,
      message: "Product found",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      discription,
      more_details,
      publish,
    } = req.body;

    // Find product by ID
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product fields
    product.name = name || product.name;
    product.image = image || product.image;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.unit = unit || product.unit;
    product.stock = stock !== undefined ? stock : product.stock;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.discription = discription || product.discription;
    product.more_details = more_details || product.more_details;
    product.publish = publish !== undefined ? publish : product.publish;

    // Save updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

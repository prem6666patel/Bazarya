import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createProductController,
  getProductController,
  getAllProductController,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/create", auth, createProductController);
productRouter.post("/get", getProductController);
productRouter.get("/getAll", getAllProductController);
productRouter.post("/getProductByCategory", getProductByCategory);
productRouter.post(
  "/getProductByCategoryAndSubCategory",
  getProductByCategoryAndSubCategory
);
productRouter.post("/getProductById", getProductById);
productRouter.put("/update/:id", auth, updateProduct);
productRouter.delete("/delete/:id", auth, deleteProduct);

export default productRouter;

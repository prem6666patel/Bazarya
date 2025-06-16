import { Router } from "express";
import {
  AddSubCategory,
  getSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import auth from "../middleware/auth.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create", auth, AddSubCategory);
subCategoryRouter.post("/get", getSubCategory);
subCategoryRouter.delete("/delete", auth, deleteSubCategory);
subCategoryRouter.put("/update", auth, updateSubCategory);

export default subCategoryRouter;

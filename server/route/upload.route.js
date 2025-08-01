import { Router } from "express";
import uploadImageController from "../controllers/uploadImage.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const uploadRouter = Router();

uploadRouter.post("/upload", auth,upload.single("image"), uploadImageController);

export default uploadRouter;

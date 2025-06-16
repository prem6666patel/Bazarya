import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  codController,
  onlinePaymentController,
  getOrderDetailsController,
  getAllOrderDetailsController,
  updateOrderStatusController,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/cod", auth, codController);
orderRouter.post("/onlinePayment", auth, onlinePaymentController);
orderRouter.get("/getOrderDetails", auth, getOrderDetailsController);
orderRouter.get("/getAllOrderDetails", auth, getAllOrderDetailsController);
orderRouter.put("/update-status/:orderId", auth, updateOrderStatusController);

export default orderRouter;

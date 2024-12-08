import express from "express";
import * as orderController from "../controllers/orderController.mjs";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.get("/", orderController.getAllOrders);
router.get("/", orderController.getOrderByStatus);
router.put("/:id", orderController.updateOrder);

export default router;
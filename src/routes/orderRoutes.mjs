import express from "express";
import * as orderController from "../controllers/orderController.mjs";

const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);

export default router;

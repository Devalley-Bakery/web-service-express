import express from "express";
import * as productController from "../controllers/productController.mjs";

const router = express.Router();

router.get("/", productController.getProducts)   
router.get('/:id', productController.getProductById)
router.put("/:id", productController.updateProduct);    
export default router;

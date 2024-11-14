import * as productService from "../services/productService.mjs";
import { createResponse, ERROR_MESSAGES } from "../error.message.js";

export async function updateProduct(req, res) {
    const productId = req.params.id;
    const { price, stockQuantity } = req.body;
    if (price === undefined && stockQuantity === undefined) {
        return res.status(400).json(createResponse(400, "No valid fields provided for update"));
    }

    try {
        const updatedProduct = await productService.updateProduct(productId, price, stockQuantity);
        if (!updatedProduct) {
            return res.status(404).json(createResponse(404, ERROR_MESSAGES.productNotFound));
        }
        res.status(201).json(updatedProduct);
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(statusCode).json(createResponse(statusCode, message, { error: error.message }));
    }
}

export async function getProducts(req, res) {
    try {
        const products = await productService.getProducts();
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id)
        res.status(200).json(product)
    } catch (error) {
        console.log("Erro: ", error)
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}
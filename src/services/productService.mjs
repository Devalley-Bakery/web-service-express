import { PrismaClient } from "@prisma/client";
import { createResponse, ERROR_MESSAGES } from "../error.message.js";
const prisma = new PrismaClient();

export async function updateProduct(productId, price, quantity) {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
    });

    if (!product) return createResponse(404, ERROR_MESSAGES.productNotFound)

    const newProduct = {
        price: price ? price : product.price,
        stockQuantity: quantity ? quantity : product.stockQuantity,
    };

    try {
        const updateProduct =  await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { price: newProduct.price, stockQuantity: newProduct.stockQuantity },
        });
        return {status: 201, data: updateProduct}
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        error.status = 500;
        throw error;
    }
}

export async function getProducts() {
    const products = await prisma.product.findMany();
    return { status: 200, data: products }
}

export async function getProductById(productId) {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
    });

    if (!product) return createResponse(404, ERROR_MESSAGES.productNotFound)
    return { status: 200, data: product };
}
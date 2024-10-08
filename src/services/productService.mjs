import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function updateProduct(productId, price, quantity) {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
    });

    if (!product) {
        const error = new Error('Produto não encontrado.')
        error.status = 404;
        throw error;
    }

    const newProduct = {
        price: price ? price : product.price,
        stockQuantity: quantity ? quantity : product.stockQuantity,
    };

    try {
        return await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { price: newProduct.price, stockQuantity: newProduct.stockQuantity },
        });
    } catch (error) {
        console.error('Erro ao atualizar o produto:', error);
        error.status = 500;
        throw error;
    }
}

export async function getProducts() {
    return await prisma.product.findMany();
}

export async function getProductById(productId) {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
    });

    if (!product) {
        const error = new Error('Produto não encontrado.')
        error.status = 404;
        throw error;
    }

    return product;
}
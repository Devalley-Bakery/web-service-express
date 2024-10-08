import * as productService from "../services/productService.mjs";

export async function updateProduct(req, res) {
    const productId = req.params.id;
    const { price, stockQuantity } = req.body;
    if (price === undefined && stockQuantity === undefined) {
        return res.status(400).json({ message: "Nenhum campo válido enviado para atualização" });
    }

    try {
        const updatedProduct = await productService.updateProduct(productId, price, stockQuantity);
        if (!updatedProduct) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.status(201).json(updatedProduct);
    } catch (error) {
        if (error.status === 404) {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Erro ao atualizar o produto', error: error.message });
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

export async function getProductById(res, req) {
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
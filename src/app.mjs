import { PrismaClient } from "@prisma/client";
import express from "express"

const app = express()
const PORT = process.env.PORT || 3000
const prisma = new PrismaClient();

app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema de gerenciamento da padaria!');
})

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
})


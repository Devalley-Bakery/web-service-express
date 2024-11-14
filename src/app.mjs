import orderRoutes from "./routes/orderRoutes.mjs";
import productRoutes from "./routes/productOrders.mjs";
import express from "express";
import cors from 'cors'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));

app.use(express.json());
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

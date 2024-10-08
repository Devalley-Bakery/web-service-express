import orderRoutes from "./routes/orderRoutes.mjs";
import productRoutes from "./routes/productOrders.mjs";

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



/**
 * DOCUMENTAÇÃO
 * 

  PRODUCTS: 
    --- GET : "//http://localhost:3000/products"

    --- PUT : "//http://localhost:3000/products/id"
        {
          stockQuantity: 10,
          price: 20.5
        }        

 */
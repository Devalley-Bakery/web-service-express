import orderRoutes from './routes/orderRoutes.mjs'
import express from "express"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());

// ex: http://localhost:3000/orders
app.use('/orders', orderRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
})


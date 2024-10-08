import * as orderService from "../services/orderService.mjs";

export async function createOrder(req, res) {
  try {
    const { employeeId, products } = req.body;
    const order = await orderService.createOrder(employeeId, products);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


//Exemplo de requisição:
// http://localhost:3000/orders?active=true
export async function getOrderByStatus(req, res) {
  try {
    const { active } = req.query;
    const order = await orderService.getOrderByStatus(active);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

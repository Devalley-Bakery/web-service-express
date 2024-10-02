import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createOrder(employeeId, products) {
  //Verifico se o funcionário existe
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found.");

  let total = 0;
  const orderProducts = [];

  //Mapeamento dos produtos
  for (const item of products) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }
    if (product.stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}.`);
    }

    total += product.price * item.quantity;

    orderProducts.push({ productId: item.productId, quantity: item.quantity });

    //Atualizar o estoque somente quando o pedido for realizado!
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQuantity: product.stockQuantity - item.quantity },
    });
  }

  const newOrder = await prisma.orders.create({
    data: {
      employeeId: employeeId,
      total: total,
      status: "in_progress",
    },
  });

  //Criação do pedido
  for (const item of orderProducts) {
    await prisma.orderProduct.create({
      data: {
        orderId: newOrder.id, // Relacionando com o pedido recém-criado
        productId: item.productId,
        quantity: item.quantity,
      },
    });
  }

  return newOrder;
}

export async function getOrderById(id) {
  const order = await prisma.orders.findUnique({
    where: { id: parseInt(id) },
    include: {
      products: {
        include: {
          product: {
            select: {
              name: true,
              price: true, // Exibindo o preço
            },
          },
        },
      },
    },
  });

  if (!order) {
    return resizeBy.status(404).json({ error: "Order not found." });
  }

  const orderDetails = {
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    ordeDate: order.orderDate,
    products: order.products.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    })),
  };
  return orderDetails;
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createOrder(employeeId, products) {
  // Verifico se o funcionário existe
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) throw new Error("Employee not found.");

  let total = 0;
  const orderProducts = [];

  // Mapeamento dos produtos
  for (const item of products) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}.`);
    }

    total += product.price * item.quantity;

    orderProducts.push({ productId: item.productId, quantity: item.quantity });

    // Atualizar o estoque somente quando o pedido for realizado!
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock_quantity: product.stock_quantity - item.quantity },
    });
  }

  // Criação do pedido
  const newOrder = await prisma.orders.create({
    data: {
      employee_id: employeeId,  // Usando o campo correto
      total: total,
      status: "in_progress",
    },
  });

  // Criação do pedido
  for (const item of orderProducts) {
    await prisma.orderproduct.create({  // Usando o nome correto da tabela
      data: {
        order_id: newOrder.id,  // Usando o campo correto
        product_id: item.productId,
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
      orderproduct: { // Mudando para orderproduct
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
    return { status: 404, json: { error: "Order not found." } }; // Corrigindo o retorno
  }

  const orderDetails = {
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    orderDate: order.order_date, // Corrigido para order_date
    products: order.orderproduct.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    })),
  };
  return orderDetails;
}

export async function getOrderByStatus(status) {
  if (!status) {
    return { status: 400, data: { error: "Status is required." } };
  }

  if (status !== "in_progress" && status !== "completed" && status !== "canceled") {
    return { status: 400, data: { error: "Invalid status." } };
  }

  const orders = await prisma.orders.findMany({
    where: { status: status },
    include: {
      orderproduct: { // Mudando para orderproduct
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (orders.length === 0) {
    return { status: 404, json: { error: "Order not found." } }; // Corrigindo o retorno
  }

  const orderDetails = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    orderDate: order.order_date,
    products: order.orderproduct.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    })),
  }));

  return orderDetails; // Retornando a lista de pedidos
}

export async function updateOrder(id, status) {

  if (!status) {
    return { status: 400, data: { error: "Status is required." } };
  }

  if (status !== "in_progress" && status !== "completed" && status !== "canceled") {
    return { status: 400, data: { error: "Invalid status." } };
  }

  const order = await prisma.orders.findUnique({
    where: { id: parseInt(id) },
  });

  if (!order) {
    return { status: 404, data: { error: "Order not found." } };
  }

  if (order.status === "completed" || order.status === "canceled") {
    return { status: 400, data: { error: "Order cannot be updated." } };
  }

  const updatedOrder = await prisma.orders.update({
    where: { id: parseInt(id) },
    data: { status: status },
  });

  if (!updatedOrder) {
    return { status: 500, data: { error: "Failed to update order." } };
  }

  return {status: "Order status successfully updated"};
}
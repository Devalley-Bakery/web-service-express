import { PrismaClient } from "@prisma/client";
import { createResponse, ERROR_MESSAGES } from "../error.message.js";
const prisma = new PrismaClient();

export async function createOrder(employeeId, products) {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });;
  if (!employee)  return createResponse(404, ERROR_MESSAGES.employeeNotFound)

  const { total, orderProducts, productUpdates } = await calculateOrderDetails(products);

  
  const newOrder = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.orders.create({
      data: {
        employeeId,
        total,
        status: "in_progress",
      },
    });

    await updateProductStock(tx, productUpdates);
    await createOrderProducts(tx, createdOrder.id, orderProducts);

    return createdOrder;
  });

  return createResponse(201, "Order created successfully.", newOrder);
}

async function calculateOrderDetails(products) {
  let total = 0;
  const orderProducts = [];
  const productUpdates = [];

  for (const item of products) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product)  throw new Error(ERROR_MESSAGES.orderNotFound);

    if (product.stockQuantity < item.quantity) throw new Error(ERROR_MESSAGES.insufficientStock);

    total += product.price * item.quantity;
    orderProducts.push({ productId: item.productId, quantity: item.quantity });
    productUpdates.push({ id: item.productId, newStock: product.stockQuantity - item.quantity });
  }

  return { total, orderProducts, productUpdates };
}

async function updateProductStock(tx, productUpdates) {
  await Promise.all(
    productUpdates.map((update) =>
      tx.product.update({
        where: { id: update.id },
        data: { stockQuantity: update.newStock },
      })
    )
  );
}

async function createOrderProducts(tx, orderId, orderProducts) {
  await Promise.all(
    orderProducts.map((item) =>
      tx.orderProduct.create({
        data: {
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        },
      })
    )
  );
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
              price: true,
            },
          },
        },
      },
    },
  });

  if (!order) return createResponse(404, ERROR_MESSAGES.orderNotFound);

  const orderDetails = {
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    orderDate: order.orderDate,
    products: order.products.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    })),
  };
  return { status: 200, data: orderDetails };
}

export async function getAllOrders() {
  const orders = await prisma.orders.findMany({
    include: {
      products: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              imagePath: true,
            },
          },
        },
      },
    },
  });

  if (orders.length === 0) return createResponse(404, ERROR_MESSAGES.orderNotFound);

  const orderDetails = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    orderDate: order.orderDate,
    products: order.products.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      imagePath: item.product.imagePath
    })),
  }));

  return { status: 200, data: orderDetails };

}

export async function getOrderByStatus(status) {
  if (!["in_progress", "completed", "canceled"].includes(status))
    return createResponse(400, ERROR_MESSAGES.invalidStatus);

  const orders = await prisma.orders.findMany({
    where: { status: status },
    include: {
      products: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              imagePath: true,
            },
          },
        },
      },
    },
  });

  if (orders.length === 0) return createResponse(404, ERROR_MESSAGES.orderNotFound);

  const orderDetails = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: parseFloat(order.total),
    orderDate: order.orderDate,
    products: order.products.map((item) => ({
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      imagePath: item.product.imagePath
    })),
  }));

  return { status: 200, data: orderDetails };
}

export async function updateOrder(id, status) {
  if (!["in_progress", "completed", "canceled"].includes(status))
    return createResponse(400, ERROR_MESSAGES.invalidStatus);

  const order = await prisma.orders.findUnique({ where: { id: parseInt(id) } });

  if (!order) return createResponse(404, ERROR_MESSAGES.orderNotFound);

  if (["completed", "canceled"].includes(order.status))
    return createResponse(400, ERROR_MESSAGES.orderUpdateError);

  const updatedOrder = await prisma.orders.update({
    where: { id: parseInt(id) },
    data: { status },
  });

  if (!updatedOrder) {
    return { status: 500, data: { error: "Failed to update order." } };
  }

  return { status: 201, message: "Order status successfully updated" };
}

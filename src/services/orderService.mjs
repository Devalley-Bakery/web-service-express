import { PrismaClient } from "@prisma/client"; // Importando o Prisma Client para interagir com o banco de dados
const prisma = new PrismaClient(); // Criando uma instância do Prisma Client para utilizar nas operações do banco

// Função para criar um pedido
export async function createOrder(employeeId, products) {
  // Verificando se o funcionário existe no banco de dados
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }, // Procurando pelo ID do funcionário
  });
  if (!employee) throw new Error("Employee not found."); // Lançando erro se o funcionário não for encontrado

  let total = 0; // Variável para armazenar o total do pedido
  const orderProducts = []; // Array para armazenar os produtos do pedido

  // Mapeamento dos produtos que fazem parte do pedido
  for (const item of products) {
    // Procurando o produto pelo ID
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`); // Se o produto não for encontrado, lançar erro
    }
    // Verificando se o estoque do produto é suficiente
    if (product.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name}.`); // Lançar erro se o estoque for insuficiente
    }

    // Calculando o total do pedido
    total += product.price * item.quantity;

    // Adicionando o produto e a quantidade no array de produtos do pedido
    orderProducts.push({ productId: item.productId, quantity: item.quantity });

    // Atualizando o estoque do produto após realizar o pedido
    await prisma.product.update({
      where: { id: item.productId },
      data: { stockQuantity: product.stockQuantity - item.quantity }, // Subtraindo a quantidade comprada do estoque
    });
  }

  // Criando o pedido no banco de dados
  const newOrder = await prisma.orders.create({
    data: {
      employeeId: employeeId, // ID do funcionário que fez o pedido
      total: total, // Total do pedido
      status: "in_progress", // Status inicial do pedido
    },
  });

  // Inserindo os produtos associados ao pedido
  for (const item of orderProducts) {
    await prisma.orderProduct.create({
      data: {
        orderId: newOrder.id, // ID do pedido
        productId: item.productId, // ID do produto
        quantity: item.quantity, // Quantidade do produto no pedido
      },
    });
  }

  return newOrder; // Retorna o novo pedido criado
}

// Função para obter um pedido pelo ID
export async function getOrderById(id) {
  // Buscando o pedido pelo ID no banco de dados
  const order = await prisma.orders.findUnique({
    where: { id: parseInt(id) }, // Convertendo o ID para inteiro
    include: {
      products: { // Incluindo os produtos associados ao pedido
        include: {
          product: {
            select: {
              name: true, // Selecionando o nome do produto
              price: true, // Selecionando o preço do produto
            },
          },
        },
      },
    },
  });

  if (!order) {
    return { status: 404, json: { error: "Order not found." } }; // Se o pedido não for encontrado, retornar erro
  }

  // Montando o objeto com os detalhes do pedido
  const orderDetails = {
    id: order.id,
    status: order.status,
    total: parseFloat(order.total), // Convertendo o total para float
    orderDate: order.orderDate, // Data do pedido
    products: order.products.map((item) => ({
      productName: item.product.name, // Nome do produto
      quantity: item.quantity, // Quantidade do produto
      price: item.product.price, // Preço do produto
    })),
  };

  return orderDetails; // Retorna os detalhes do pedido
}

// Função para obter pedidos com base no status
export async function getOrderByStatus(status) {
  if (!status) {
    return { status: 400, data: { error: "Status is required." } }; // Se o status não for fornecido, retornar erro
  }

  // Verificando se o status fornecido é válido
  if (status !== "in_progress" && status !== "completed" && status !== "canceled") {
    return { status: 400, data: { error: "Invalid status." } }; // Se o status for inválido, retornar erro
  }

  // Buscando pedidos com o status fornecido
  const orders = await prisma.orders.findMany({
    where: { status: status }, // Filtrando pedidos pelo status
    include: {
      products: {
        include: {
          product: {
            select: {
              name: true, // Selecionando o nome do produto
              price: true, // Selecionando o preço do produto
            },
          },
        },
      },
    },
  });
  
  if (orders.length === 0) {
    return { status: 404, json: { error: "Order not found." } }; // Se não encontrar pedidos, retornar erro
  }

  // Montando a lista de pedidos com os detalhes
  const orderDetails = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: parseFloat(order.total), // Convertendo o total para float
    orderDate: order.orderDate, // Data do pedido
    products: order.products.map((item) => ({
      productName: item.product.name, // Nome do produto
      quantity: item.quantity, // Quantidade do produto
      price: item.product.price, // Preço do produto
    })),
  }));

  return orderDetails; // Retorna a lista de pedidos com os detalhes
}

// Função para atualizar o status de um pedido
export async function updateOrder(id, status) {
  if (!status) {
    return { status: 400, data: { error: "Status is required." } }; // Se o status não for fornecido, retornar erro
  }

  // Verificando se o status fornecido é válido
  if (status !== "in_progress" && status !== "completed" && status !== "canceled") {
    return { status: 400, data: { error: "Invalid status." } }; // Se o status for inválido, retornar erro
  }

  // Buscando o pedido pelo ID
  const order = await prisma.orders.findUnique({
    where: { id: parseInt(id) }, // Convertendo o ID para inteiro
  });

  if (!order) {
    return { status: 404, data: { error: "Order not found." } }; // Se o pedido não for encontrado, retornar erro
  }

  // Verificando se o pedido já está completado ou cancelado (não pode ser alterado)
  if (order.status === "completed" || order.status === "canceled") {
    return { status: 400, data: { error: "Order cannot be updated." } }; // Retornar erro se o pedido não puder ser atualizado
  }

  // Atualizando o status do pedido
  const updatedOrder = await prisma.orders.update({
    where: { id: parseInt(id) }, // Convertendo o ID para inteiro
    data: { status: status }, // Atualizando o status do pedido
  });

  if (!updatedOrder) {
    return { status: 500, data: { error: "Failed to update order." } }; // Se falhar na atualização, retornar erro
  }

  return {status: "Order status successfully updated"}; // Retorna uma mensagem de sucesso
}

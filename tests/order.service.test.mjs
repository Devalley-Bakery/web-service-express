import * as orderService from "../src/services/orderService.mjs";
import prisma from "../prisma/index.mjs";

jest.mock("../prisma/index.mjs", () => ({
  employee: { findUnique: jest.fn() },
  product: { findUnique: jest.fn() },
  orders: {
    create: jest.fn(), findUnique: jest.fn(),
    update: jest.fn()
  },
  $transaction: jest.fn(),
}));

describe("Order Service - UC01 Criar pedido", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Fluxo Principal: Criação de pedido válida
  test("TC_UC01_001: Deve retornar status 201 ao criar pedido válido", async () => {
    const employeeId = 1;
    const products = [{ productId: 1, quantity: 2 }];
    const employeeMock = { id: 1, name: "Funcionario Teste" };
    const productMock = { id: 1, price: 10, stockQuantity: 5 };
    const createdOrderMock = { id: 1, employeeId, total: 20, status: "in_progress" };

    prisma.employee.findUnique.mockResolvedValueOnce(employeeMock);
    prisma.product.findUnique.mockResolvedValueOnce(productMock);
    prisma.$transaction.mockResolvedValueOnce(createdOrderMock);

    const result = await orderService.createOrder(employeeId, products);

    expect(result.status).toBe(201);
  });


   // Fluxo de Exceção: Produto inexistente
  test("TC_UC01_002: Deve lançar erro se o produto não existir", async () => {
    const products = [{ productId: 999, quantity: 1 }]; // Produto inexistente

    prisma.product.findUnique.mockResolvedValueOnce(null);

    await expect(orderService.calculateOrderDetails(products)).rejects.toThrow("Order not found.");
  });

// Fluxo de Exceção: Lista de produtos inválida
  it("TC_UC01_003: Deve retornar mensagem de produtos inválidos ", async () => {
    const employeeId = 1;
    const products = [];

    const employeeMock = { id: 1, name: "Funcionario Teste" };

    prisma.employee.findUnique.mockResolvedValueOnce(employeeMock);

    const result = await orderService.createOrder(employeeId, products);

    expect(result.message).toBe("Invalid products");
  });

  // Fluxo de Exceção: Quantidade superior ao estoque disponível
  test("TC_UC01_004: Cadastro com item com quantidade superior à disponibilizada no estoque", async () => {
    const products = [{ productId: 1, quantity: 61 }];
    const productMock = { id: 1, price: 10, stockQuantity: 5 }; // Estoque insuficiente

    prisma.product.findUnique.mockResolvedValueOnce(productMock);

    await expect(orderService.calculateOrderDetails(products)).rejects.toThrow(
      "Insufficient stock for this product."
    );
  });
  
//  Fluxo Alternativo: Pedido com quantidade igual ao limite do estoque
// test("TC_UC01_006: Deve permitir criar pedido com produtos no limite do estoque disponível", async () => {
//   const products = [{ productId: 1, quantity: 5 }]; // Quantidade igual ao estoque
//   const productMock = { id: 1, price: 10, stockQuantity: 5 }; // Estoque exato

//   prisma.product.findUnique.mockResolvedValueOnce(productMock);

//   const { productUpdates } = await orderService.calculateOrderDetails(products);

//   expect(productUpdates).toEqual([{ id: 1, newStock: 0 }]); // Estoque atualizado para zero
// });


// Fluxo Principal: Verificar cálculo total do pedido
  test("TC_UC01_005: Verificar cálculo total do pedido", async () => {
    const products = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ];

    const productMocks = {
      1: { id: 1, price: 10, stockQuantity: 5 },
      2: { id: 2, price: 20, stockQuantity: 10 },
    };

    prisma.product.findUnique.mockImplementation(({ where }) => {
      const productId = where.id;
      return Promise.resolve(productMocks[productId]);
    });

    const { total } = await orderService.calculateOrderDetails(products);

    expect(total).toBe(80); // (2 x 10) + (3 x 20) = 80
  });

  // Fluxo Principal: Atualizar estoque corretamente após o cálculo
  test("TC_UC01_005_02: Deve atualizar os dados de estoque corretamente", async () => {
    const products = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ];

    const productMocks = {
      1: { id: 1, price: 10, stockQuantity: 5 },
      2: { id: 2, price: 20, stockQuantity: 10 },
    };

    prisma.product.findUnique.mockImplementation(({ where }) => {
      const productId = where.id;
      return Promise.resolve(productMocks[productId]);
    });

    const { productUpdates } = await orderService.calculateOrderDetails(products);

    expect(productUpdates).toEqual([
      { id: 1, newStock: 3 }, // Estoque inicial (5) - Quantidade (2)
      { id: 2, newStock: 7 }, // Estoque inicial (10) - Quantidade (3)
    ]);
  });
});

describe("Order Service - UC02 Atualizar status do pedido", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Fluxo Principal: Atualizar status de pedido válido para 'completed'
  test("TC_UC02_001: Atualizar status de pedido para 'completed'", async () => {
    const orderId = 3;
    const newStatus = "completed";
    const orderMock = { id: orderId, status: "in_progress" };
    const updatedOrderMock = { ...orderMock, status: newStatus };

    prisma.orders.findUnique.mockResolvedValueOnce(orderMock);
    prisma.orders.update.mockResolvedValueOnce(updatedOrderMock);

    const result = await orderService.updateOrder(orderId, newStatus);

    expect(result.status).toBe(201);
  });

  test("TC_UC02_001_02: Verifica mensagem de sucesso ao atualizar status para 'completed'", async () => {
    const orderId = 3;
    const newStatus = "completed";
    const orderMock = { id: orderId, status: "in_progress" };
    const updatedOrderMock = { ...orderMock, status: newStatus };

    prisma.orders.findUnique.mockResolvedValueOnce(orderMock);
    prisma.orders.update.mockResolvedValueOnce(updatedOrderMock);

    const result = await orderService.updateOrder(orderId, newStatus);

    expect(result.message).toBe("Order status successfully updated");
  });


  // Fluxo Alternativo: Tentativa de atualizar status para um valor inválido
  test("TC_UC02_002: Atualizar status para valor inválido", async () => {
    const orderId = 3;
    const invalidStatus = "invalid_status";

    const result = await orderService.updateOrder(orderId, invalidStatus);

    expect(result.message).toBe("Invalid status value.");
  });

  // Fluxo de Exceção: Pedido não encontrado
  test("TC_UC02_003: Tentativa de atualizar status de pedido inexistente", async () => {
    const orderId = 999;
    const newStatus = "completed";

    prisma.orders.findUnique.mockResolvedValueOnce(null);

    const result = await orderService.updateOrder(orderId, newStatus);

    expect(result.message).toBe("Order not found.");
  });

  // Fluxo de Exceção: Atualizar status de pedido já 'completed' ou 'canceled'
  test("TC_UC02_004: Tentativa de atualizar pedido já finalizado ou cancelado", async () => {
    const orderId = 3;
    const newStatus = "in_progress";
    const orderMock = { id: orderId, status: "completed" }; // Pedido já finalizado

    prisma.orders.findUnique.mockResolvedValueOnce(orderMock);

    const result = await orderService.updateOrder(orderId, newStatus);

    expect(result.message).toBe("Order update error.");
  });

  // Fluxo Principal: Atualizar status para 'canceled'
  test("TC_UC03_005: Atualizar status de pedido para 'canceled'", async () => {
    const orderId = 5;
    const newStatus = "canceled";
    const orderMock = { id: orderId, status: "in_progress" };
    const updatedOrderMock = { ...orderMock, status: newStatus };

    prisma.orders.findUnique.mockResolvedValueOnce(orderMock);
    prisma.orders.update.mockResolvedValueOnce(updatedOrderMock);

    const result = await orderService.updateOrder(orderId, newStatus);

    expect(result.status).toBe(201);
  });

  test("TC_UC02_005_B: Verifica mensagem de sucesso ao atualizar status para 'canceled'", async () => {
    const orderId = 5;
    const newStatus = "canceled";
    const orderMock = { id: orderId, status: "in_progress" };
    const updatedOrderMock = { ...orderMock, status: newStatus };

    prisma.orders.findUnique.mockResolvedValueOnce(orderMock);
    prisma.orders.update.mockResolvedValueOnce(updatedOrderMock);

    const result = await orderService.updateOrder(orderId, newStatus);

    expect(result.message).toBe("Order status successfully updated");
  });
})
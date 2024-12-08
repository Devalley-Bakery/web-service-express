import * as orderService from "../src/services/orderService.mjs";
import prisma from "../prisma/index.mjs";

jest.mock("../prisma/index.mjs", () => ({
  employee: { findUnique: jest.fn() },
  product: { findUnique: jest.fn() },
  orders: { create: jest.fn() },
  $transaction: jest.fn(),
}));

describe("Order Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("TC_001: Cadastrar pedidos com dados válidos", async () => {
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
    expect(result.message).toBe("Order created successfully.");
    expect(result.data).toEqual(createdOrderMock);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it("TC_002: Cadastrar pedidos sem itens selecionados (array vazio)", async () => {
    const employeeId = 1;
    const products = [];
  
    const employeeMock = { id: 1, name: "Funcionario Teste" };
  
    prisma.employee.findUnique.mockResolvedValueOnce(employeeMock);
  
    const result = await orderService.createOrder(employeeId, products);
  
    expect(result.status).toBe(404);
    expect(result.message).toBe("Invalid products");
    expect(result.data).toBe(undefined);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
  
  
  it("TC_002: Cadastrar pedidos sem itens selecionados (`products` ausente)", async () => {
    const employeeId = 1;
  
    const employeeMock = { id: 1, name: "Funcionario Teste" };
  
    prisma.employee.findUnique.mockResolvedValueOnce(employeeMock);
  
    const result = await orderService.createOrder(employeeId);
  
    expect(result.status).toBe(404);
    expect(result.message).toBe("Invalid products");
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});

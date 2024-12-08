import { jest } from "@jest/globals";
import prisma from "../../prisma/index.mjs";
import * as orderService from "../services/orderService.mjs";

jest.mock("../../prisma/index.mjs");

describe("Order Service - createOrder", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa mocks após cada teste
  });

  it("deve criar um pedido com sucesso", async () => {
    // Dados de entrada
    const employeeId = 1;
    const products = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ];

    // Mock do Prisma
    prisma.employee.findUnique.mockResolvedValue({ id: employeeId, name: "John Doe" });
    prisma.product.findUnique.mockImplementation((query) => {
      const productsMock = {
        1: { id: 1, price: 10.0, stockQuantity: 5 },
        2: { id: 2, price: 15.0, stockQuantity: 3 },
      };
      return Promise.resolve(productsMock[query.where.id]);
    });
    prisma.orders.create.mockResolvedValue({ id: 1, employeeId, total: 35.0, status: "in_progress" });
    prisma.$transaction.mockImplementation((callback) => callback(prisma));

    // Chama a função
    const response = await orderService.createOrder(employeeId, products);

    // Valida o resultado
    expect(response.status).toBe(201);
    expect(response.data).toMatchObject({
      id: 1,
      employeeId,
      total: 35.0,
      status: "in_progress",
    });

    // Valida se os métodos do Prisma foram chamados corretamente
    expect(prisma.employee.findUnique).toHaveBeenCalledWith({ where: { id: employeeId } });
    expect(prisma.product.findUnique).toHaveBeenCalledTimes(2);
    expect(prisma.orders.create).toHaveBeenCalled();
  });

  it("deve retornar erro se o funcionário não for encontrado", async () => {
    // Mock do Prisma
    prisma.employee.findUnique.mockResolvedValue(null);

    // Dados de entrada
    const employeeId = 99;
    const products = [];

    // Chama a função e captura o erro
    const response = await orderService.createOrder(employeeId, products);

    // Valida o resultado
    expect(response.status).toBe(404);
    expect(response.message).toBe("Employee not found");

    // Valida se o método do Prisma foi chamado
    expect(prisma.employee.findUnique).toHaveBeenCalledWith({ where: { id: employeeId } });
  });

  it("deve retornar erro se o estoque for insuficiente", async () => {
    // Mock do Prisma
    prisma.employee.findUnique.mockResolvedValue({ id: 1, name: "John Doe" });
    prisma.product.findUnique.mockResolvedValue({ id: 1, price: 10.0, stockQuantity: 1 }); // Estoque insuficiente

    const products = [{ productId: 1, quantity: 2 }];

    // Chama a função e espera erro
    await expect(orderService.createOrder(1, products)).rejects.toThrow("Insufficient stock");

    // Valida se os métodos do Prisma foram chamados corretamente
    expect(prisma.product.findUnique).toHaveBeenCalled();
  });
});

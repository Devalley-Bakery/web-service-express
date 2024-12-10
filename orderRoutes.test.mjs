import request from "supertest";
import express from "express";
import orderRoutes from "./orderRoutes.mjs"; // Certifique-se de ajustar o caminho, se necessário.
import * as orderService from "../services/orderService.mjs"; // Mock dos serviços.

const app = express();
app.use(express.json());
app.use("/orders", orderRoutes);

jest.mock("../services/orderService.mjs"); // Mockando os serviços

describe("Order Routes", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  test("POST /orders - Deve criar um pedido com sucesso", async () => {
    const mockOrder = { id: 1, employeeId: 1, status: "in_progress" };
    orderService.createOrder.mockResolvedValue(mockOrder);

    const response = await request(app)
      .post("/orders")
      .send({ employeeId: 1, products: [{ productId: 1, quantity: 2 }] });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockOrder);
    expect(orderService.createOrder).toHaveBeenCalledWith(1, [
      { productId: 1, quantity: 2 },
    ]);
  });

  test("GET /orders/:id - Deve retornar um pedido pelo ID", async () => {
    const mockOrder = { id: 1, employeeId: 1, status: "in_progress" };
    orderService.getOrderById.mockResolvedValue(mockOrder);

    const response = await request(app).get("/orders/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrder);
    expect(orderService.getOrderById).toHaveBeenCalledWith("1");
  });

  test("GET /orders?status=completed - Deve retornar pedidos por status", async () => {
    const mockOrders = [{ id: 1, status: "completed" }];
    orderService.getOrderByStatus.mockResolvedValue(mockOrders);

    const response = await request(app).get("/orders?status=completed");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
    expect(orderService.getOrderByStatus).toHaveBeenCalledWith("completed");
  });

  test("PUT /orders/:id - Deve atualizar o status do pedido", async () => {
    const mockUpdatedOrder = { status: "Order status successfully updated" };
    orderService.updateOrder.mockResolvedValue(mockUpdatedOrder);

    const response = await request(app)
      .put("/orders/1")
      .send({ status: "completed" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedOrder);
    expect(orderService.updateOrder).toHaveBeenCalledWith("1", "completed");
  });
});

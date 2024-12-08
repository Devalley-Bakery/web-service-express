import { createOrder } from "../src/controllers/orderController.mjs";
import prisma from "../prisma/index.mjs"
import * as orderService from "../src/services/orderService.mjs";

jest.mock("../prisma/index.mjs", () => ({
  employee: {
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
}));

// jest.mock("../src/services/orderService.mjs", () => ({
//   ...jest.requireActual("../src/services/orderService.mjs"), // Manter outras funções reais
//   calculateOrderDetails: jest.fn(), // Mock de calculateOrderDetails
// }));

describe("Order Service - Cadastro de Pedido", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("TC_001 - Deve cadastrar pedido com dados válidos", async () => {
    // Dados de entrada
    const mockEmployee = { id: 1, name: "John Doe" };
    const mockProducts = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ];
    const mockProductDetails = [
      { id: 1, price: 10, stockQuantity: 5 },
      { id: 2, price: 15, stockQuantity: 10 },
    ];

    prisma.employee.findUnique.mockResolvedValue(mockEmployee);
    prisma.product.findUnique
      .mockImplementationOnce(() => Promise.resolve(mockProductDetails[0]))
      .mockImplementationOnce(() => Promise.resolve(mockProductDetails[1]));

    prisma.$transaction.mockResolvedValue({
      id: 1,
      employeeId: mockEmployee.id,
      total: 65, // (10 * 2) + (15 * 3)
      status: "in_progress",
    });

    const response = await orderService.createOrder(mockEmployee.id, mockProducts);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Order created successfully.");
    expect(response.data.total).toBe(65);
  });
});

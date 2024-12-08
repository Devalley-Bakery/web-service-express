const prismaMock = {
  employee: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  orders: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  orderProduct: {
    create: jest.fn(),
  },
};

export default prismaMock;

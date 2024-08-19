// __mocks__/prismaClient.ts
const mockPrismaClient = {
  product: {
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  // Add other models as needed
};

export default mockPrismaClient;

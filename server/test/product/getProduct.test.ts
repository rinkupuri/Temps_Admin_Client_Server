import request from "supertest";
import app from "../../server"; // Adjust this path to your app entry point
import prismaClient from "../../mocks/prismaClient"; // Adjust this path to your Prisma client

jest.mock("../path_to_your_prisma_client"); // Mock the Prisma client

describe("GET /get - getProducts", () => {
  // Mock data
  const mockProducts = [
    {
      id: 1,
      image: "image-url-1",
      brand: "brand 1",
      modelName: "Model X",
      totalStock: 10,
      consumerOffer: "10% off",
      mrp: 999.99,
      stockId: {
        ddnStock: 1,
        dlStock: 2,
        godwanStock: 3,
        ibStock: 4,
        mainStock: 5,
        mtStock: 6,
        smapleLine: 7,
      },
    },
  ];

  // Mock implementation for findMany and count
  beforeAll(() => {
    (prismaClient.product.findMany as jest.Mock).mockResolvedValue(
      mockProducts
    );
    (prismaClient.product.count as jest.Mock).mockResolvedValue(
      mockProducts.length
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should fetch products with default pagination and return status 200", async () => {
    const res = await request(app).get("/get");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(mockProducts.length);
    expect(res.body.meta.totalCount).toBe(mockProducts.length);
    expect(res.body.meta.currentPage).toBe(1);
    expect(res.body.meta.totalPages).toBe(1);
    expect(res.body.meta.perPage).toBe(10);
  });

  it("should handle invalid limit parameter and return status 400", async () => {
    const res = await request(app).get("/get").query({ limit: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid limit value");
  });

  it("should apply brand filter and return status 200", async () => {
    const res = await request(app).get("/get").query({ brand: "brand_1" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(mockProducts.length);
  });

  it("should handle pagination correctly", async () => {
    const res = await request(app).get("/get").query({ limit: "5", page: "1" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(mockProducts.length);
    expect(res.body.meta.currentPage).toBe(1);
    expect(res.body.meta.perPage).toBe(5);
  });

  it("should return an empty array if no products match the query", async () => {
    (prismaClient.product.findMany as jest.Mock).mockResolvedValue([]);
    (prismaClient.product.count as jest.Mock).mockResolvedValue(0);

    const res = await request(app)
      .get("/get")
      .query({ brand: "nonexistent_brand" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(0);
    expect(res.body.meta.totalCount).toBe(0);
    expect(res.body.meta.totalPages).toBe(0);
  });
});

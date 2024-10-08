import request from "supertest";
import app from "../../server";

let authCookie: string;

beforeAll(async () => {
  // Login to get the auth cookie
  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({ username: "user@example.com", password: "yourpassword" });

  // Assuming the cookie is in the 'set-cookie' header
  console.log(loginResponse.headers);
  authCookie = loginResponse.headers["set-cookie"][0];
});

describe("Product API", () => {
  it("should create a new product", async () => {
    const response = await request(app)
      .post("/api/v1/product/create")
      .set("Cookie", authCookie) // Include the auth cookie here
      .send({
        name: "Test Product",
        price: 100,
        stock: 50,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Test Product");
  });

  it("should fetch all products", async () => {
    const response = await request(app)
      .get("/api/v1/product/get")
      .set("Cookie", authCookie); // Include the auth cookie here
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

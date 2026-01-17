// tests/user.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import { seedDB, clearDB } from "../src/db.js";

beforeEach(async () => {
  await seedDB(); // fakedata
});

afterEach(async () => {
  await clearDB(); // empty
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/users/:id", () => {
  it("should return the seeded user", async () => {
    const res = await request(app).get("/api/v1/users/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice");
  });

  it("should return 404 for non-existing user", async () => {
    const res = await request(app).get("/api/v1/users/999");
    expect(res.statusCode).toBe(404);
  });
});
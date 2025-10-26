import request from "supertest";
import { describe, it, expect } from "vitest";
const base = "http://localhost:5174";

describe("Products", () => {
  it("list common", async () => {
    const res = await request(base).get("/api/products/common");
    expect(res.status).toBe(200);
  });
});

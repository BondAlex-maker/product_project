import request from "supertest";
import { describe, it, expect } from "vitest";
const base = "http://localhost:5174";

describe("Auth", () => {
  it("should reject wrong creds", async () => {
    const res = await request(base).post("/api/auth/signin").send({ username: "x", password: "y" });
    expect([400,401, 404]).toContain(res.status);
  });
});

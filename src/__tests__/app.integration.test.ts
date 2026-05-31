import request from "supertest";
import { createApp } from "../app.js";

describe("app integration", () => {
  test("GET / returns health response", async () => {
    const app = createApp();
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: "Gamification API OK" });
  });

  test("GET /docs serves swagger UI", async () => {
    const app = createApp();
    const res = await request(app).get("/docs/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("CarbonQuest API Documentation");
  });
});

import { AuthController } from "../auth.controller.js";
import { AuthService } from "../../services/auth.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("AuthController", () => {
  test("registerUser returns created", async () => {
    jest
      .spyOn(AuthService.prototype, "registerUser")
      .mockResolvedValue({ user: { id_user: 1 }, token: "t" } as any);
    const controller = new AuthController();

    const req = { body: { email: "a@b.com", password: "x" } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("loginUser forwards errors", async () => {
    const error = new Error("bad");
    jest.spyOn(AuthService.prototype, "loginUser").mockRejectedValue(error);
    const controller = new AuthController();

    const req = { body: { email: "a@b.com", password: "x" } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.loginUser(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

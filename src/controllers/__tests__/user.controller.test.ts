import { UserController } from "../user.controller.js";
import { UserService } from "../../services/user.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("UserController", () => {
  test("getAllUsers returns success", async () => {
    jest
      .spyOn(UserService.prototype, "getAllUsers")
      .mockResolvedValue([] as any);
    const controller = new UserController();

    const res = createMockResponse();
    const next = createMockNext();

    await controller.getAllUsers({} as any, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updateUser blocks when not owner", async () => {
    const controller = new UserController();
    const req = { params: { id: "2" }, user: { sub: 1 } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.updateUser(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("uploadProfileImage errors when no file", async () => {
    const controller = new UserController();
    const req = { params: { id: "1" }, user: { sub: 1 } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.uploadProfileImage(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

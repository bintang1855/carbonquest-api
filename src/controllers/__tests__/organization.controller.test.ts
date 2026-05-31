import { OrganizationController } from "../organization.controller.js";
import { OrganizationService } from "../../services/organization.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("OrganizationController", () => {
  test("getAllOrganizations returns success", async () => {
    jest
      .spyOn(OrganizationService.prototype, "getAllOrganizations")
      .mockResolvedValue([] as any);
    const controller = new OrganizationController();

    const res = createMockResponse();
    const next = createMockNext();

    await controller.getAllOrganizations({} as any, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("updatePassword forwards errors", async () => {
    const error = new Error("bad");
    jest
      .spyOn(OrganizationService.prototype, "updatePassword")
      .mockRejectedValue(error);
    const controller = new OrganizationController();

    const req = {
      body: { oldPassword: "a", newPassword: "b" },
      user: { sub: 2 },
    } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.updatePassword(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

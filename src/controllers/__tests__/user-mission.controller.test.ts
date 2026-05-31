import { UserMissionController } from "../user-mission.controller.js";
import { UserMissionService } from "../../services/user-mission.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("UserMissionController", () => {
  test("startMission returns created", async () => {
    jest
      .spyOn(UserMissionService.prototype, "startMission")
      .mockResolvedValue({ id_working: 1 } as any);
    const controller = new UserMissionController();

    const req = { body: { id_mission: 1 }, user: { sub: 2 } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.startMission(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("updateMission forwards errors", async () => {
    const error = new Error("bad");
    jest
      .spyOn(UserMissionService.prototype, "updateMission")
      .mockRejectedValue(error);
    const controller = new UserMissionController();

    const req = { params: { id: "1" }, body: { status: "done" } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.updateMission(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

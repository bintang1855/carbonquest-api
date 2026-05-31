import { MissionController } from "../mission.controller.js";
import { MissionService } from "../../services/mission.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("MissionController", () => {
  test("createMission uses build data and returns created", async () => {
    const createSpy = jest
      .spyOn(MissionService.prototype, "createMission")
      .mockResolvedValue({ id_mission: 1 } as any);
    const controller = new MissionController();

    const req = {
      body: { title: "T", points: "5" },
      file: { filename: "cover.png" },
      user: { sub: 3 },
    } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.createMission(req, res, next);

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "T",
        points: 5,
        cover_image: "/files/cover.png",
      }),
      3,
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("getMissionById forwards errors", async () => {
    const error = new Error("bad");
    jest
      .spyOn(MissionService.prototype, "getMissionById")
      .mockRejectedValue(error);
    const controller = new MissionController();

    const req = { params: { id: "1" } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.getMissionById(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

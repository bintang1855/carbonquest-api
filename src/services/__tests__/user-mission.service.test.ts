import { UserMissionService } from "../user-mission.service.js";
import { UserMissionRepository } from "../../repositories/user-mission.repository.js";

describe("UserMissionService", () => {
  test("startMission passes user id", async () => {
    const createSpy = jest
      .spyOn(UserMissionRepository.prototype, "create")
      .mockResolvedValue({ id_working: 1 } as any);

    const service = new UserMissionService();
    await service.startMission({ id_mission: 2 } as any, 7);

    expect(createSpy).toHaveBeenCalledWith({ id_mission: 2, id_user: 7 });
  });

  test("updateMission converts completed_time", async () => {
    const updateSpy = jest
      .spyOn(UserMissionRepository.prototype, "update")
      .mockResolvedValue({ id_working: 1 } as any);

    const service = new UserMissionService();
    await service.updateMission(1, {
      completed_time: "2026-05-31T00:00:00.000Z",
    } as any);

    expect(updateSpy).toHaveBeenCalledWith(1, {
      status: undefined,
      points: undefined,
      completed_time: expect.any(Date),
    });
  });
});

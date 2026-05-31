import { MissionService } from "../mission.service.js";
import { MissionRepository } from "../../repositories/mission.repository.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("MissionService", () => {
  test("getMissionById throws when missing", async () => {
    jest
      .spyOn(MissionRepository.prototype, "findById")
      .mockResolvedValue(null as any);
    const service = new MissionService();

    await expect(service.getMissionById(1)).rejects.toBeInstanceOf(AppError);
  });

  test("createMission passes creator id", async () => {
    const createSpy = jest
      .spyOn(MissionRepository.prototype, "create")
      .mockResolvedValue({ id_mission: 1 } as any);
    const service = new MissionService();

    await service.createMission({ title: "T" } as any, 9);

    expect(createSpy).toHaveBeenCalledWith({ title: "T", id_creator: 9 });
  });

  test("deleteMission calls repository delete", async () => {
    jest
      .spyOn(MissionRepository.prototype, "findById")
      .mockResolvedValue({ id_mission: 1 } as any);
    const deleteSpy = jest
      .spyOn(MissionRepository.prototype, "delete")
      .mockResolvedValue(undefined as any);

    const service = new MissionService();
    await service.deleteMission(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});

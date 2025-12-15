import { CreateMissionDTO } from "../../types/index.js";
import { MissionRepository } from "./mission.repository.js";

export class MissionService {
  private repository: MissionRepository;

  constructor() {
    this.repository = new MissionRepository();
  }

  async getAllMissions() {
    return await this.repository.findAll();
  }

  async createMission(data: CreateMissionDTO, creatorId: number) {
    return await this.repository.create({
      ...data,
      id_creator: creatorId,
    });
  }

  async getMissionById(id: number) {
    const mission = await this.repository.findById(id);
    if (!mission) {
      throw new Error("Mission not found");
    }
    return mission;
  }

  async updateMission(id: number, data: Partial<CreateMissionDTO>) {
    // Check if mission exists
    await this.getMissionById(id);
    return await this.repository.update(id, data);
  }

  async deleteMission(id: number) {
    // Check if mission exists
    await this.getMissionById(id);
    await this.repository.delete(id);
  }
}

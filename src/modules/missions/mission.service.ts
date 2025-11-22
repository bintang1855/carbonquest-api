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
}

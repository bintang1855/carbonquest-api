import {
  CreateUserMissionDTO,
  UpdateUserMissionDTO,
} from "../../types/index.js";
import { UserMissionRepository } from "./user-mission.repository.js";

export class UserMissionService {
  private repository: UserMissionRepository;

  constructor() {
    this.repository = new UserMissionRepository();
  }

  async startMission(data: CreateUserMissionDTO, userId: number) {
    return await this.repository.create({
      ...data,
      id_user: userId,
    });
  }

  async updateMission(id: number, data: UpdateUserMissionDTO) {
    const updateData: any = {
      status: data.status,
      points: data.points,
    };

    if (data.completed_time) {
      updateData.completed_time = new Date(data.completed_time);
    }

    return await this.repository.update(id, updateData);
  }

  async getUserMissions(userId: number) {
    return await this.repository.findByUserId(userId);
  }
}

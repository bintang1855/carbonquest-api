import { CreateUserMissionDTO, UpdateUserMissionDTO } from "../types/index.js";
import { UserMissionRepository } from "../repositories/user-mission.repository.js";

interface MissionUpdateData {
  status?: string;
  points?: number;
  completed_time?: Date;
}

export class UserMissionService {
  private repository: UserMissionRepository;

  constructor() {
    this.repository = new UserMissionRepository();
  }

  async startMission(data: CreateUserMissionDTO, userId: number) {
    return await this.repository.create({ ...data, id_user: userId });
  }

  async updateMission(id: number, data: UpdateUserMissionDTO) {
    const updateData: MissionUpdateData = {
      status: data.status,
      points: data.points,
      completed_time: data.completed_time ? new Date(data.completed_time) : undefined,
    };

    return await this.repository.update(id, updateData);
  }

  async getUserMissions(userId: number) {
    return await this.repository.findByUserId(userId);
  }
}

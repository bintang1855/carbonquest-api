import { CreateSessionDTO, UpdateSessionDTO } from "../../types/index.js";
import { SessionRepository } from "./session.repository.js";

export class SessionService {
  private repository: SessionRepository;

  constructor() {
    this.repository = new SessionRepository();
  }

  async createSession(data: CreateSessionDTO, userId: number) {
    return await this.repository.create({
      ...data,
      id_user: userId,
    });
  }

  async updateSession(id: number, data: UpdateSessionDTO) {
    const updateData: any = {
      total_points: data.total_points,
    };

    if (data.end_time) {
      updateData.end_time = new Date(data.end_time);
    } else {
      updateData.end_time = new Date();
    }

    return await this.repository.update(id, updateData);
  }

  async getUserSessions(userId: number) {
    return await this.repository.findByUserId(userId);
  }
}

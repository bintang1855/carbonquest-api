import prisma from "../../prisma/client.js";
import { CreateSessionDTO, SessionDTO } from "../../types/index.js";

export class SessionRepository {
  async create(
    data: CreateSessionDTO & { id_user: number }
  ): Promise<SessionDTO> {
    return await prisma.sessions.create({
      data: {
        id_user: data.id_user,
        id_answer: data.id_answer,
        total_points: data.total_points ?? 0,
        start_time: data.start_time ? new Date(data.start_time) : new Date(),
        end_time: data.end_time ? new Date(data.end_time) : null,
      },
    });
  }

  async update(id: number, data: Partial<SessionDTO>): Promise<SessionDTO> {
    return await prisma.sessions.update({
      where: { id_session: id },
      data,
    });
  }

  async findByUserId(userId: number) {
    return await prisma.sessions.findMany({
      where: { id_user: userId },
      include: { answer: true },
    });
  }
}

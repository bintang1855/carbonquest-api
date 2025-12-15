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
        id_quiz: data.id_quiz,
        session_type: data.session_type,
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
      include: {
        answer: {
          include: {
            question: true,
          },
        },
        quiz: true,
      },
      orderBy: {
        start_time: "desc",
      },
    });
  }

  async getWeeklyPoints(userId: number, weeks: number = 4) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    // Get quiz sessions
    const quizSessions = await prisma.sessions.findMany({
      where: {
        id_user: userId,
        session_type: "quiz",
        end_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        total_points: true,
        end_time: true,
      },
    });

    // Get mission completions
    const missionCompletions = await prisma.user_Missions.findMany({
      where: {
        id_user: userId,
        completed_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        points: true,
        completed_time: true,
      },
    });

    return { quizSessions, missionCompletions };
  }
}

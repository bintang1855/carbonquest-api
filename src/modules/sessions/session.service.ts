import {
  CreateSessionDTO,
  UpdateSessionDTO,
  WeeklyPointsDTO,
} from "../../types/index.js";
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

  async getWeeklyPointsHistory(
    userId: number,
    days: number = 7
  ): Promise<WeeklyPointsDTO[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1)); // Get last N days
    startDate.setHours(0, 0, 0, 0); // Start of day

    const { quizSessions, missionCompletions } =
      await this.repository.getWeeklyPoints(userId, Math.ceil(days / 7));

    // Group by day
    const dailyData = new Map<string, WeeklyPointsDTO>();

    // Helper function to get day key (YYYY-MM-DD format)
    const getDayKey = (date: Date): string => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split("T")[0];
    };

    // Initialize all days with 0 values
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayKey = getDayKey(date);
      dailyData.set(dayKey, {
        week: dayKey, // Keeping property name for backward compatibility
        mission_points: 0,
        quiz_points: 0,
        total_points: 0,
        missions_completed: 0,
        quizzes_completed: 0,
      });
    }

    // Process quiz sessions
    quizSessions.forEach((session) => {
      if (session.end_time) {
        const dayKey = getDayKey(session.end_time);
        if (dailyData.has(dayKey)) {
          const dayData = dailyData.get(dayKey)!;
          dayData.quiz_points += session.total_points || 0;
          dayData.quizzes_completed += 1;
          dayData.total_points = dayData.mission_points + dayData.quiz_points;
        }
      }
    });

    // Process mission completions
    missionCompletions.forEach((mission) => {
      if (mission.completed_time) {
        const dayKey = getDayKey(mission.completed_time);
        if (dailyData.has(dayKey)) {
          const dayData = dailyData.get(dayKey)!;
          dayData.mission_points += mission.points || 0;
          dayData.missions_completed += 1;
          dayData.total_points = dayData.mission_points + dayData.quiz_points;
        }
      }
    });

    // Convert to array and sort by date (oldest first for chart display)
    return Array.from(dailyData.values()).sort((a, b) =>
      a.week.localeCompare(b.week)
    );
  }
    // Convert to array and sort by date (oldest first for chart display)
    return Array.from(dailyData.values()).sort((a, b) =>
      a.week.localeCompare(b.week)
    );
  }
}

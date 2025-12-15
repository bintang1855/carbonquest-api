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
    weeks: number = 4
  ): Promise<WeeklyPointsDTO[]> {
    const { quizSessions, missionCompletions } =
      await this.repository.getWeeklyPoints(userId, weeks);

    // Group by week
    const weeklyData = new Map<string, WeeklyPointsDTO>();

    // Helper function to get week key (ISO week format)
    const getWeekKey = (date: Date): string => {
      const d = new Date(date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay()); // Start of week (Sunday)
      return weekStart.toISOString().split("T")[0];
    };

    // Process quiz sessions
    quizSessions.forEach((session) => {
      if (session.end_time) {
        const weekKey = getWeekKey(session.end_time);
        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, {
            week: weekKey,
            mission_points: 0,
            quiz_points: 0,
            total_points: 0,
            missions_completed: 0,
            quizzes_completed: 0,
          });
        }
        const weekData = weeklyData.get(weekKey)!;
        weekData.quiz_points += session.total_points || 0;
        weekData.quizzes_completed += 1;
        weekData.total_points = weekData.mission_points + weekData.quiz_points;
      }
    });

    // Process mission completions
    missionCompletions.forEach((mission) => {
      if (mission.completed_time) {
        const weekKey = getWeekKey(mission.completed_time);
        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, {
            week: weekKey,
            mission_points: 0,
            quiz_points: 0,
            total_points: 0,
            missions_completed: 0,
            quizzes_completed: 0,
          });
        }
        const weekData = weeklyData.get(weekKey)!;
        weekData.mission_points += mission.points || 0;
        weekData.missions_completed += 1;
        weekData.total_points = weekData.mission_points + weekData.quiz_points;
      }
    });

    // Convert to array and sort by week (newest first)
    return Array.from(weeklyData.values()).sort((a, b) =>
      b.week.localeCompare(a.week)
    );
  }
}

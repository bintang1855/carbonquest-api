import { SessionService } from "../session.service.js";
import { SessionRepository } from "../../repositories/session.repository.js";

describe("SessionService", () => {
  test("updateSession sets end_time date", async () => {
    const updateSpy = jest
      .spyOn(SessionRepository.prototype, "update")
      .mockResolvedValue({ id_session: 1 } as any);

    const service = new SessionService();
    await service.updateSession(1, {
      total_points: 10,
      end_time: "2026-05-31T00:00:00.000Z",
    } as any);

    expect(updateSpy).toHaveBeenCalledWith(1, {
      total_points: 10,
      end_time: expect.any(Date),
    });
  });

  test("getWeeklyPointsHistory aggregates quiz and mission points", async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-31T00:00:00.000Z"));

    jest
      .spyOn(SessionRepository.prototype, "getWeeklyPoints")
      .mockResolvedValue({
        quizSessions: [
          { total_points: 5, end_time: new Date("2026-05-30T10:00:00.000Z") },
        ],
        missionCompletions: [
          { points: 3, completed_time: new Date("2026-05-30T12:00:00.000Z") },
        ],
      } as any);

    const service = new SessionService();
    const result = await service.getWeeklyPointsHistory(7, 2);

    const totalPoints = result.reduce(
      (sum, entry) => sum + entry.total_points,
      0,
    );
    const totalMissions = result.reduce(
      (sum, entry) => sum + entry.missions_completed,
      0,
    );
    const totalQuizzes = result.reduce(
      (sum, entry) => sum + entry.quizzes_completed,
      0,
    );

    expect(totalPoints).toBe(8);
    expect(totalMissions).toBe(1);
    expect(totalQuizzes).toBe(1);

    jest.useRealTimers();
  });
});

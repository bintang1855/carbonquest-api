import { SessionController } from "../session.controller.js";
import { SessionService } from "../../services/session.service.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

describe("SessionController", () => {
  test("getUserSessions returns success", async () => {
    jest
      .spyOn(SessionService.prototype, "getUserSessions")
      .mockResolvedValue([] as any);
    const controller = new SessionController();

    const req = { user: { sub: 1 } } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.getUserSessions(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("getDailyPoints uses default days", async () => {
    const spy = jest
      .spyOn(SessionService.prototype, "getWeeklyPointsHistory")
      .mockResolvedValue([] as any);
    const controller = new SessionController();

    const req = { user: { sub: 1 }, query: {} } as any;
    const res = createMockResponse();
    const next = createMockNext();

    await controller.getDailyPoints(req, res, next);

    expect(spy).toHaveBeenCalledWith(1, 7);
  });
});

import { errorHandler, AppError } from "../error.middleware.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

const makeReq = () => ({}) as any;

describe("errorHandler", () => {
  test("handles AppError with provided status", () => {
    const res = createMockResponse();
    const next = createMockNext();

    errorHandler(new AppError("Not found", 404), makeReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Not found",
      error: "Not found",
    });
  });

  test("handles generic error", () => {
    const res = createMockResponse();
    const next = createMockNext();

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    errorHandler(new Error("Boom"), makeReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
      error: undefined,
    });

    process.env.NODE_ENV = originalEnv;
  });
});

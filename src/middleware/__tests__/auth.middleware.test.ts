import jwt from "jsonwebtoken";
import { authMiddleware, generateToken } from "../auth.middleware.js";
import {
  createMockNext,
  createMockResponse,
} from "../../__tests__/test-helpers.js";

const makeReq = (auth?: string) => ({
  headers: auth ? { authorization: auth } : {},
});

describe("authMiddleware", () => {
  test("returns 401 when no auth header", () => {
    const req = makeReq();
    const res = createMockResponse();
    const next = createMockNext();

    authMiddleware()(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
      error: undefined,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when token invalid", () => {
    const req = makeReq("Bearer bad");
    const res = createMockResponse();
    const next = createMockNext();

    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("bad token");
    });

    authMiddleware()(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token",
      error: undefined,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when role mismatch", () => {
    const req = makeReq("Bearer ok");
    const res = createMockResponse();
    const next = createMockNext();

    jest.spyOn(jwt, "verify").mockReturnValue({ sub: 1, role: "user" } as any);

    authMiddleware("org")(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Forbidden",
      error: undefined,
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("sets req.user and calls next on success", () => {
    const req = makeReq("Bearer ok");
    const res = createMockResponse();
    const next = createMockNext();

    jest.spyOn(jwt, "verify").mockReturnValue({ sub: 7, role: "user" } as any);

    authMiddleware("user")(req as any, res, next);

    expect((req as any).user).toEqual({ sub: 7, role: "user" });
    expect(next).toHaveBeenCalled();
  });
});

describe("generateToken", () => {
  test("creates a signed token", () => {
    const token = generateToken({ sub: 1, role: "user" });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(10);
  });
});

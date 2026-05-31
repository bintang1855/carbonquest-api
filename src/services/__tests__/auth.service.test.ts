import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "../auth.service.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { OrganizationRepository } from "../../repositories/organization.repository.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("AuthService", () => {
  test("registerUser throws when missing fields", async () => {
    const service = new AuthService();
    await expect(
      service.registerUser({ email: "" } as any),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("registerUser rejects when email exists", async () => {
    jest
      .spyOn(UserRepository.prototype, "findByEmail")
      .mockResolvedValue({ id_user: 1 } as any);
    const service = new AuthService();

    await expect(
      service.registerUser({
        name: "A",
        email: "a@b.com",
        password: "pass",
      } as any),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("registerUser returns user and token", async () => {
    jest
      .spyOn(UserRepository.prototype, "findByEmail")
      .mockResolvedValue(null as any);
    jest.spyOn(UserRepository.prototype, "create").mockResolvedValue({
      id_user: 1,
      name: "A",
      email: "a@b.com",
      password: "hashed",
    } as any);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed");
    jest.spyOn(jwt, "sign").mockReturnValue("token" as any);

    const service = new AuthService();
    const result = await service.registerUser({
      name: "A",
      email: "a@b.com",
      password: "pass",
    } as any);

    expect(result.token).toBe("token");
    expect((result.user as any).password).toBeUndefined();
  });

  test("loginUser throws when invalid password", async () => {
    jest.spyOn(UserRepository.prototype, "findByEmail").mockResolvedValue({
      id_user: 1,
      email: "a@b.com",
      password: "hashed",
    } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const service = new AuthService();
    await expect(
      service.loginUser({ email: "a@b.com", password: "bad" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("loginUser returns user and token", async () => {
    jest.spyOn(UserRepository.prototype, "findByEmail").mockResolvedValue({
      id_user: 1,
      email: "a@b.com",
      password: "hashed",
    } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(jwt, "sign").mockReturnValue("token" as any);

    const service = new AuthService();
    const result = await service.loginUser({
      email: "a@b.com",
      password: "pass",
    });

    expect(result.token).toBe("token");
    expect((result.user as any).password).toBeUndefined();
  });

  test("registerOrganization returns org and token", async () => {
    jest
      .spyOn(OrganizationRepository.prototype, "findByEmail")
      .mockResolvedValue(null as any);
    jest.spyOn(OrganizationRepository.prototype, "create").mockResolvedValue({
      id_organisasi: 2,
      name: "Org",
      email: "o@b.com",
      password: "hashed",
    } as any);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("hashed");
    jest.spyOn(jwt, "sign").mockReturnValue("token" as any);

    const service = new AuthService();
    const result = await service.registerOrganization({
      name: "Org",
      email: "o@b.com",
      password: "pass",
    } as any);

    expect(result.token).toBe("token");
    expect((result.org as any).password).toBeUndefined();
  });

  test("loginOrganization rejects invalid password", async () => {
    jest
      .spyOn(OrganizationRepository.prototype, "findByEmail")
      .mockResolvedValue({
        id_organisasi: 2,
        email: "o@b.com",
        password: "hashed",
      } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const service = new AuthService();
    await expect(
      service.loginOrganization({ email: "o@b.com", password: "bad" }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

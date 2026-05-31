import bcrypt from "bcryptjs";
import { UserService } from "../user.service.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("UserService", () => {
  test("getUserById throws when missing", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue(null as any);

    const service = new UserService();
    await expect(service.getUserById(1)).rejects.toBeInstanceOf(AppError);
  });

  test("updatePassword rejects invalid old password", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue({ password: "hash" } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const service = new UserService();
    await expect(
      service.updatePassword(1, "old", "new"),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("updatePassword hashes and updates", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue({ password: "hash" } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("newhash");
    const updateSpy = jest
      .spyOn(UserRepository.prototype, "updatePassword")
      .mockResolvedValue(undefined as any);

    const service = new UserService();
    await service.updatePassword(1, "old", "new");

    expect(updateSpy).toHaveBeenCalledWith(1, "newhash");
  });

  test("updateUser returns without password", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue({ id_user: 1 } as any);
    jest.spyOn(UserRepository.prototype, "update").mockResolvedValue({
      id_user: 1,
      name: "A",
      password: "hash",
    } as any);

    const service = new UserService();
    const result = await service.updateUser(1, { name: "A" } as any);

    expect((result as any).password).toBeUndefined();
  });

  test("deleteUser calls repository delete", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue({ id_user: 1 } as any);
    const deleteSpy = jest
      .spyOn(UserRepository.prototype, "delete")
      .mockResolvedValue(undefined as any);

    const service = new UserService();
    await service.deleteUser(1);

    expect(deleteSpy).toHaveBeenCalledWith(1);
  });
});

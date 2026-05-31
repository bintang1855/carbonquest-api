import bcrypt from "bcryptjs";
import { OrganizationService } from "../organization.service.js";
import { OrganizationRepository } from "../../repositories/organization.repository.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("OrganizationService", () => {
  test("getAllOrganizations strips password", async () => {
    jest
      .spyOn(OrganizationRepository.prototype, "findAll")
      .mockResolvedValue([
        { id_organisasi: 1, name: "Org", password: "hash" },
      ] as any);

    const service = new OrganizationService();
    const result = await service.getAllOrganizations();

    expect((result[0] as any).password).toBeUndefined();
  });

  test("updatePassword throws when org missing", async () => {
    jest
      .spyOn(OrganizationRepository.prototype, "findById")
      .mockResolvedValue(null as any);
    const service = new OrganizationService();

    await expect(
      service.updatePassword(1, "old", "new"),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("updatePassword rejects invalid old password", async () => {
    jest
      .spyOn(OrganizationRepository.prototype, "findById")
      .mockResolvedValue({ password: "hash" } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

    const service = new OrganizationService();
    await expect(
      service.updatePassword(1, "old", "new"),
    ).rejects.toBeInstanceOf(AppError);
  });

  test("updatePassword hashes and updates", async () => {
    jest
      .spyOn(OrganizationRepository.prototype, "findById")
      .mockResolvedValue({ password: "hash" } as any);
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
    jest.spyOn(bcrypt, "hash").mockResolvedValue("newhash");
    const updateSpy = jest
      .spyOn(OrganizationRepository.prototype, "updatePassword")
      .mockResolvedValue(undefined as any);

    const service = new OrganizationService();
    await service.updatePassword(1, "old", "new");

    expect(updateSpy).toHaveBeenCalledWith(1, "newhash");
  });
});

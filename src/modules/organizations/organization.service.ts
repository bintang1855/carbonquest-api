import { OrganizationDTO } from "../../types/index.js";
import { OrganizationRepository } from "./organization.repository.js";
import { AppError } from "../../middleware/error.middleware.js";
import bcrypt from "bcryptjs";

export class OrganizationService {
  private repository: OrganizationRepository;

  constructor() {
    this.repository = new OrganizationRepository();
  }

  async getAllOrganizations(): Promise<Omit<OrganizationDTO, "password">[]> {
    const orgs = await this.repository.findAll();
    return orgs.map(({ password, ...org }) => org);
  }

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const org = await this.repository.findById(id);

    if (!org) {
      throw new AppError("Organization not found", 404);
    }

    if (!org.password) {
      throw new AppError("Invalid organization data", 500);
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, org.password);
    if (!isValidPassword) {
      throw new AppError("Invalid old password", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.repository.updatePassword(id, hashedPassword);
  }
}

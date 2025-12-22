import prisma from "../prisma/client.js";
import { CreateOrganizationDTO, OrganizationDTO } from "../types/index.js";

export class OrganizationRepository {
  async findById(id: number): Promise<OrganizationDTO | null> {
    return await prisma.organization.findUnique({
      where: { id_organisasi: id },
    });
  }

  async findByEmail(email: string): Promise<OrganizationDTO | null> {
    return await prisma.organization.findFirst({
      where: { email },
    });
  }

  async findAll(): Promise<OrganizationDTO[]> {
    return await prisma.organization.findMany();
  }

  async create(data: CreateOrganizationDTO): Promise<OrganizationDTO> {
    return await prisma.organization.create({
      data,
    });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await prisma.organization.update({
      where: { id_organisasi: id },
      data: { password: hashedPassword },
    });
  }
}

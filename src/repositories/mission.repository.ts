import prisma from "../prisma/client.js";
import { CreateMissionDTO, MissionDTO } from "../types/index.js";

export class MissionRepository {
  async findAll() {
    return await prisma.missions.findMany({
      include: { creator: true },
    });
  }

  async findById(id: number) {
    return await prisma.missions.findUnique({
      where: { id_mission: id },
      include: { creator: true },
    });
  }

  async create(
    data: CreateMissionDTO & { id_creator: number }
  ): Promise<MissionDTO> {
    return await prisma.missions.create({
      data,
    });
  }

  async update(
    id: number,
    data: Partial<CreateMissionDTO>
  ): Promise<MissionDTO> {
    return await prisma.missions.update({
      where: { id_mission: id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.$transaction([
      prisma.user_Missions.deleteMany({
        where: { id_mission: id },
      }),
      prisma.missions.delete({
        where: { id_mission: id },
      }),
    ]);
  }
}

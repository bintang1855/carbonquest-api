import prisma from "../prisma/client.js";
import { CreateUserDTO, UserDTO } from "../types/index.js";

interface LeaderboardEntry {
  id_user: number;
  name: string;
  email: string;
  total_points: number;
  session_points: number;
  mission_points: number;
}

export class UserRepository {
  async findById(id: number): Promise<UserDTO | null> {
    return await prisma.users.findUnique({ where: { id_user: id } });
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    return await prisma.users.findFirst({ where: { email } });
  }

  async findAll(): Promise<UserDTO[]> {
    return await prisma.users.findMany();
  }

  async create(data: CreateUserDTO): Promise<UserDTO> {
    return await prisma.users.create({ data });
  }

  async update(id: number, data: Partial<CreateUserDTO>): Promise<UserDTO> {
    return await prisma.users.update({ where: { id_user: id }, data });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await prisma.users.update({
      where: { id_user: id },
      data: { password: hashedPassword },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.users.delete({ where: { id_user: id } });
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const users = await prisma.users.findMany({
      include: {
        sessions: { select: { total_points: true } },
        user_mission: { select: { points: true } },
      },
    });

    return users
      .map((user) => ({
        id_user: user.id_user,
        name: user.name,
        email: user.email,
        session_points: this.sumPoints(user.sessions, "total_points"),
        mission_points: this.sumPoints(user.user_mission, "points"),
        total_points:
          this.sumPoints(user.sessions, "total_points") +
          this.sumPoints(user.user_mission, "points"),
      }))
      .sort((a, b) => b.total_points - a.total_points);
  }

  private sumPoints<T extends Record<string, any>>(items: T[], key: keyof T): number {
    return items.reduce((sum, item) => sum + (item[key] || 0), 0);
  }
}

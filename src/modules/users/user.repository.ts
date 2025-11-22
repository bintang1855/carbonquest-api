import prisma from "../../prisma/client.js";
import { CreateUserDTO, UserDTO } from "../../types/index.js";

export class UserRepository {
  async findById(id: number): Promise<UserDTO | null> {
    return await prisma.users.findUnique({
      where: { id_user: id },
    });
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    return await prisma.users.findFirst({
      where: { email },
    });
  }

  async findAll(): Promise<UserDTO[]> {
    return await prisma.users.findMany();
  }

  async create(data: CreateUserDTO): Promise<UserDTO> {
    return await prisma.users.create({
      data,
    });
  }
}

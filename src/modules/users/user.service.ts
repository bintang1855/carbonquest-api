import { AppError } from "../../middleware/error.middleware.js";
import { UserDTO } from "../../types/index.js";
import { UserRepository } from "./user.repository.js";

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getAllUsers(): Promise<UserDTO[]> {
    return await this.repository.findAll();
  }

  async getUserById(id: number): Promise<Omit<UserDTO, "password">> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getLeaderboard(): Promise<any[]> {
    return await this.repository.getLeaderboard();
  }
}

import { AppError } from "../../middleware/error.middleware.js";
import { CreateUserDTO, UserDTO } from "../../types/index.js";
import { UserRepository } from "./user.repository.js";
import bcrypt from "bcryptjs";

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

  async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.password) {
      throw new AppError("Invalid user data", 500);
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new AppError("Invalid old password", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.repository.updatePassword(id, hashedPassword);
  }

  async updateUser(
    id: number,
    data: Partial<Omit<UserDTO, "id_user" | "password">>
  ): Promise<Omit<UserDTO, "password">> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await this.repository.update(
      id,
      data as Partial<CreateUserDTO>
    );
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.repository.delete(id);
  }

  async updateProfileImage(
    id: number,
    profile_image: string
  ): Promise<Omit<UserDTO, "password">> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await this.repository.update(id, { profile_image });
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

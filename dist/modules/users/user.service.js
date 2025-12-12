import { AppError } from "../../middleware/error.middleware.js";
import { UserRepository } from "./user.repository.js";
import bcrypt from "bcryptjs";
export class UserService {
    repository;
    constructor() {
        this.repository = new UserRepository();
    }
    async getAllUsers() {
        return await this.repository.findAll();
    }
    async getUserById(id) {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new AppError("User not found", 404);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getLeaderboard() {
        return await this.repository.getLeaderboard();
    }
    async updatePassword(id, oldPassword, newPassword) {
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
}
//# sourceMappingURL=user.service.js.map
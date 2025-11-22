import { AppError } from "../../middleware/error.middleware.js";
import { UserRepository } from "./user.repository.js";
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
}
//# sourceMappingURL=user.service.js.map
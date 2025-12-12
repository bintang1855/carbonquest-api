import { UserDTO } from "../../types/index.js";
export declare class UserService {
    private repository;
    constructor();
    getAllUsers(): Promise<UserDTO[]>;
    getUserById(id: number): Promise<Omit<UserDTO, "password">>;
    getLeaderboard(): Promise<any[]>;
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map
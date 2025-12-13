import { UserDTO } from "../../types/index.js";
export declare class UserService {
    private repository;
    constructor();
    getAllUsers(): Promise<UserDTO[]>;
    getUserById(id: number): Promise<Omit<UserDTO, "password">>;
    getLeaderboard(): Promise<any[]>;
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void>;
    updateUser(id: number, data: Partial<Omit<UserDTO, "id_user" | "password">>): Promise<Omit<UserDTO, "password">>;
    deleteUser(id: number): Promise<void>;
    updateProfileImage(id: number, profile_image: string): Promise<Omit<UserDTO, "password">>;
}
//# sourceMappingURL=user.service.d.ts.map
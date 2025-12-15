import { CreateUserDTO, UserDTO } from "../../types/index.js";
export declare class UserRepository {
    findById(id: number): Promise<UserDTO | null>;
    findByEmail(email: string): Promise<UserDTO | null>;
    findAll(): Promise<UserDTO[]>;
    create(data: CreateUserDTO): Promise<UserDTO>;
    update(id: number, data: Partial<CreateUserDTO>): Promise<UserDTO>;
    updatePassword(id: number, hashedPassword: string): Promise<void>;
    delete(id: number): Promise<void>;
    getLeaderboard(): Promise<any[]>;
}
//# sourceMappingURL=user.repository.d.ts.map
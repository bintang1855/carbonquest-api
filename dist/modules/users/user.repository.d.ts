import { CreateUserDTO, UserDTO } from "../../types/index.js";
export declare class UserRepository {
    findById(id: number): Promise<UserDTO | null>;
    findByEmail(email: string): Promise<UserDTO | null>;
    findAll(): Promise<UserDTO[]>;
    create(data: CreateUserDTO): Promise<UserDTO>;
}
//# sourceMappingURL=user.repository.d.ts.map
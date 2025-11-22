import { UserDTO } from "../../types/index.js";
export declare class UserService {
    private repository;
    constructor();
    getAllUsers(): Promise<UserDTO[]>;
    getUserById(id: number): Promise<Omit<UserDTO, "password">>;
}
//# sourceMappingURL=user.service.d.ts.map
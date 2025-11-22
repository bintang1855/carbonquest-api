import { CreateOrganizationDTO, CreateUserDTO, LoginDTO, OrganizationDTO, UserDTO } from "../../types/index.js";
export declare class AuthService {
    private userRepository;
    private organizationRepository;
    constructor();
    registerUser(data: CreateUserDTO): Promise<{
        user: Omit<UserDTO, "password">;
        token: string;
    }>;
    loginUser(data: LoginDTO): Promise<{
        user: Omit<UserDTO, "password">;
        token: string;
    }>;
    registerOrganization(data: CreateOrganizationDTO): Promise<{
        org: Omit<OrganizationDTO, "password">;
        token: string;
    }>;
    loginOrganization(data: LoginDTO): Promise<{
        org: Omit<OrganizationDTO, "password">;
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map
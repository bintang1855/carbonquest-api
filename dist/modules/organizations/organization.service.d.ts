import { OrganizationDTO } from "../../types/index.js";
export declare class OrganizationService {
    private repository;
    constructor();
    getAllOrganizations(): Promise<Omit<OrganizationDTO, "password">[]>;
    updatePassword(id: number, oldPassword: string, newPassword: string): Promise<void>;
}
//# sourceMappingURL=organization.service.d.ts.map
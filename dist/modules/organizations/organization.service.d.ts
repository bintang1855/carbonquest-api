import { OrganizationDTO } from "../../types/index.js";
export declare class OrganizationService {
    private repository;
    constructor();
    getAllOrganizations(): Promise<Omit<OrganizationDTO, "password">[]>;
}
//# sourceMappingURL=organization.service.d.ts.map
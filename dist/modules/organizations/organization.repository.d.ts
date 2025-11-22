import { CreateOrganizationDTO, OrganizationDTO } from "../../types/index.js";
export declare class OrganizationRepository {
    findById(id: number): Promise<OrganizationDTO | null>;
    findByEmail(email: string): Promise<OrganizationDTO | null>;
    findAll(): Promise<OrganizationDTO[]>;
    create(data: CreateOrganizationDTO): Promise<OrganizationDTO>;
}
//# sourceMappingURL=organization.repository.d.ts.map
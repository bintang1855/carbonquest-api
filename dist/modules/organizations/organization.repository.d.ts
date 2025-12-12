import { CreateOrganizationDTO, OrganizationDTO } from "../../types/index.js";
export declare class OrganizationRepository {
    findById(id: number): Promise<OrganizationDTO | null>;
    findByEmail(email: string): Promise<OrganizationDTO | null>;
    findAll(): Promise<OrganizationDTO[]>;
    create(data: CreateOrganizationDTO): Promise<OrganizationDTO>;
    updatePassword(id: number, hashedPassword: string): Promise<void>;
}
//# sourceMappingURL=organization.repository.d.ts.map
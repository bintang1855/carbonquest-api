import { OrganizationRepository } from "./organization.repository.js";
export class OrganizationService {
    repository;
    constructor() {
        this.repository = new OrganizationRepository();
    }
    async getAllOrganizations() {
        const orgs = await this.repository.findAll();
        return orgs.map(({ password, ...org }) => org);
    }
}
//# sourceMappingURL=organization.service.js.map
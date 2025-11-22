import { OrganizationDTO } from "../../types/index.js";
import { OrganizationRepository } from "./organization.repository.js";

export class OrganizationService {
  private repository: OrganizationRepository;

  constructor() {
    this.repository = new OrganizationRepository();
  }

  async getAllOrganizations(): Promise<Omit<OrganizationDTO, "password">[]> {
    const orgs = await this.repository.findAll();
    return orgs.map(({ password, ...org }) => org);
  }
}

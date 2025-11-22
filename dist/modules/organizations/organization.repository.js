import prisma from "../../prisma/client.js";
export class OrganizationRepository {
    async findById(id) {
        return await prisma.organization.findUnique({
            where: { id_organisasi: id },
        });
    }
    async findByEmail(email) {
        return await prisma.organization.findFirst({
            where: { email },
        });
    }
    async findAll() {
        return await prisma.organization.findMany();
    }
    async create(data) {
        return await prisma.organization.create({
            data,
        });
    }
}
//# sourceMappingURL=organization.repository.js.map
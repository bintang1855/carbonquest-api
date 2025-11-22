import prisma from "../../prisma/client.js";
export class UserRepository {
    async findById(id) {
        return await prisma.users.findUnique({
            where: { id_user: id },
        });
    }
    async findByEmail(email) {
        return await prisma.users.findFirst({
            where: { email },
        });
    }
    async findAll() {
        return await prisma.users.findMany();
    }
    async create(data) {
        return await prisma.users.create({
            data,
        });
    }
}
//# sourceMappingURL=user.repository.js.map
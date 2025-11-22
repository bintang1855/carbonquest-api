import prisma from "../../prisma/client.js";
export class MissionRepository {
    async findAll() {
        return await prisma.missions.findMany({
            include: { creator: true },
        });
    }
    async findById(id) {
        return await prisma.missions.findUnique({
            where: { id_mission: id },
            include: { creator: true },
        });
    }
    async create(data) {
        return await prisma.missions.create({
            data,
        });
    }
}
//# sourceMappingURL=mission.repository.js.map
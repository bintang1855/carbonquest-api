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
    async update(id, data) {
        return await prisma.missions.update({
            where: { id_mission: id },
            data,
        });
    }
    async delete(id) {
        await prisma.missions.delete({
            where: { id_mission: id },
        });
    }
}
//# sourceMappingURL=mission.repository.js.map
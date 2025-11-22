import prisma from "../../prisma/client.js";
export class UserMissionRepository {
    async create(data) {
        return await prisma.user_Missions.create({
            data: {
                id_user: data.id_user,
                id_mission: data.id_mission,
                status: "on_going",
                points: 0,
                completed_time: null,
            },
        });
    }
    async update(id, data) {
        return await prisma.user_Missions.update({
            where: { id_working: id },
            data,
        });
    }
    async findByUserId(userId) {
        return await prisma.user_Missions.findMany({
            where: { id_user: userId },
            include: { mission: true },
        });
    }
}
//# sourceMappingURL=user-mission.repository.js.map
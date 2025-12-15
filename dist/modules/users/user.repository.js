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
    async update(id, data) {
        return await prisma.users.update({
            where: { id_user: id },
            data,
        });
    }
    async updatePassword(id, hashedPassword) {
        await prisma.users.update({
            where: { id_user: id },
            data: { password: hashedPassword },
        });
    }
    async delete(id) {
        await prisma.users.delete({
            where: { id_user: id },
        });
    }
    async getLeaderboard() {
        // Get all users with their points from sessions and user_missions
        const users = await prisma.users.findMany({
            include: {
                sessions: {
                    select: {
                        total_points: true,
                    },
                },
                user_mission: {
                    select: {
                        points: true,
                    },
                },
            },
        });
        // Calculate total points for each user
        const leaderboard = users.map((user) => {
            const sessionPoints = user.sessions.reduce((sum, session) => sum + (session.total_points || 0), 0);
            const missionPoints = user.user_mission.reduce((sum, mission) => sum + (mission.points || 0), 0);
            const totalPoints = sessionPoints + missionPoints;
            return {
                id_user: user.id_user,
                name: user.name,
                email: user.email,
                total_points: totalPoints,
                session_points: sessionPoints,
                mission_points: missionPoints,
            };
        });
        // Sort by total points descending
        return leaderboard.sort((a, b) => b.total_points - a.total_points);
    }
}
//# sourceMappingURL=user.repository.js.map
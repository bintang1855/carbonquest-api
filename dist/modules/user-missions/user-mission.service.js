import { UserMissionRepository } from "./user-mission.repository.js";
export class UserMissionService {
    repository;
    constructor() {
        this.repository = new UserMissionRepository();
    }
    async startMission(data, userId) {
        return await this.repository.create({
            ...data,
            id_user: userId,
        });
    }
    async updateMission(id, data) {
        const updateData = {
            status: data.status,
            points: data.points,
        };
        if (data.completed_time) {
            updateData.completed_time = new Date(data.completed_time);
        }
        return await this.repository.update(id, updateData);
    }
    async getUserMissions(userId) {
        return await this.repository.findByUserId(userId);
    }
}
//# sourceMappingURL=user-mission.service.js.map
import { MissionRepository } from "./mission.repository.js";
export class MissionService {
    repository;
    constructor() {
        this.repository = new MissionRepository();
    }
    async getAllMissions() {
        return await this.repository.findAll();
    }
    async createMission(data, creatorId) {
        return await this.repository.create({
            ...data,
            id_creator: creatorId,
        });
    }
    async getMissionById(id) {
        const mission = await this.repository.findById(id);
        if (!mission) {
            throw new Error("Mission not found");
        }
        return mission;
    }
    async updateMission(id, data) {
        // Check if mission exists
        await this.getMissionById(id);
        return await this.repository.update(id, data);
    }
    async deleteMission(id) {
        // Check if mission exists
        await this.getMissionById(id);
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=mission.service.js.map
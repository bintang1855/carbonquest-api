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
}
//# sourceMappingURL=mission.service.js.map
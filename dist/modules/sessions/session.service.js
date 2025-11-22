import { SessionRepository } from "./session.repository.js";
export class SessionService {
    repository;
    constructor() {
        this.repository = new SessionRepository();
    }
    async createSession(data, userId) {
        return await this.repository.create({
            ...data,
            id_user: userId,
        });
    }
    async updateSession(id, data) {
        const updateData = {
            total_points: data.total_points,
        };
        if (data.end_time) {
            updateData.end_time = new Date(data.end_time);
        }
        else {
            updateData.end_time = new Date();
        }
        return await this.repository.update(id, updateData);
    }
    async getUserSessions(userId) {
        return await this.repository.findByUserId(userId);
    }
}
//# sourceMappingURL=session.service.js.map
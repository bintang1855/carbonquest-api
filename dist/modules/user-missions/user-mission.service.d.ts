import { CreateUserMissionDTO, UpdateUserMissionDTO } from "../../types/index.js";
export declare class UserMissionService {
    private repository;
    constructor();
    startMission(data: CreateUserMissionDTO, userId: number): Promise<import("../../types/index.js").UserMissionDTO>;
    updateMission(id: number, data: UpdateUserMissionDTO): Promise<import("../../types/index.js").UserMissionDTO>;
    getUserMissions(userId: number): Promise<({
        mission: {
            id_mission: number;
            title: string;
            desc: string | null;
            points: number | null;
            id_creator: number;
        };
    } & {
        id_working: number;
        id_user: number;
        id_mission: number;
        status: string | null;
        points: number | null;
        completed_time: Date | null;
    })[]>;
}
//# sourceMappingURL=user-mission.service.d.ts.map
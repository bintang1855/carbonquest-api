import { CreateMissionDTO } from "../../types/index.js";
export declare class MissionService {
    private repository;
    constructor();
    getAllMissions(): Promise<({
        creator: {
            id_organisasi: number;
            name: string;
            email: string;
            password: string;
            desc: string | null;
        };
    } & {
        id_mission: number;
        title: string;
        desc: string | null;
        points: number | null;
        id_creator: number;
    })[]>;
    createMission(data: CreateMissionDTO, creatorId: number): Promise<import("../../types/index.js").MissionDTO>;
}
//# sourceMappingURL=mission.service.d.ts.map
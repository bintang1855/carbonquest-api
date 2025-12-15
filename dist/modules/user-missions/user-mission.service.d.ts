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
            tags: string | null;
            desc: string | null;
            cover_image: string | null;
            photo_caption: string | null;
            author_name: string | null;
            author_role: string | null;
            points: number | null;
            highlights: string | null;
            date_created: Date | null;
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
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
    })[]>;
    createMission(data: CreateMissionDTO, creatorId: number): Promise<import("../../types/index.js").MissionDTO>;
    getMissionById(id: number): Promise<{
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
    }>;
    updateMission(id: number, data: Partial<CreateMissionDTO>): Promise<import("../../types/index.js").MissionDTO>;
    deleteMission(id: number): Promise<void>;
}
//# sourceMappingURL=mission.service.d.ts.map
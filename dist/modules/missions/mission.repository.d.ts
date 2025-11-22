import { CreateMissionDTO, MissionDTO } from "../../types/index.js";
export declare class MissionRepository {
    findAll(): Promise<({
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
    findById(id: number): Promise<({
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
    }) | null>;
    create(data: CreateMissionDTO & {
        id_creator: number;
    }): Promise<MissionDTO>;
}
//# sourceMappingURL=mission.repository.d.ts.map
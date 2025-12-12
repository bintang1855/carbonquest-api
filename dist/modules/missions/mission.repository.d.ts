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
    }) | null>;
    create(data: CreateMissionDTO & {
        id_creator: number;
    }): Promise<MissionDTO>;
}
//# sourceMappingURL=mission.repository.d.ts.map
import { CreateUserMissionDTO, UserMissionDTO } from "../../types/index.js";
export declare class UserMissionRepository {
    create(data: CreateUserMissionDTO & {
        id_user: number;
    }): Promise<UserMissionDTO>;
    update(id: number, data: Partial<UserMissionDTO>): Promise<UserMissionDTO>;
    findByUserId(userId: number): Promise<({
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
//# sourceMappingURL=user-mission.repository.d.ts.map
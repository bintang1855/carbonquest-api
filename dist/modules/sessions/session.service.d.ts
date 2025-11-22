import { CreateSessionDTO, UpdateSessionDTO } from "../../types/index.js";
export declare class SessionService {
    private repository;
    constructor();
    createSession(data: CreateSessionDTO, userId: number): Promise<import("../../types/index.js").SessionDTO>;
    updateSession(id: number, data: UpdateSessionDTO): Promise<import("../../types/index.js").SessionDTO>;
    getUserSessions(userId: number): Promise<({
        answer: {
            id_answer: number;
            points: number | null;
            desc: string | null;
            id_question: number;
        };
    } & {
        id_session: number;
        start_time: Date | null;
        end_time: Date | null;
        total_points: number | null;
        id_user: number;
        id_answer: number;
    })[]>;
}
//# sourceMappingURL=session.service.d.ts.map
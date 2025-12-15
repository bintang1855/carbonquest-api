import { CreateSessionDTO, SessionDTO } from "../../types/index.js";
export declare class SessionRepository {
    create(data: CreateSessionDTO & {
        id_user: number;
    }): Promise<SessionDTO>;
    update(id: number, data: Partial<SessionDTO>): Promise<SessionDTO>;
    findByUserId(userId: number): Promise<({
        answer: {
            id_answer: number;
            id_question: number;
            content: string;
            is_correct: boolean;
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
//# sourceMappingURL=session.repository.d.ts.map
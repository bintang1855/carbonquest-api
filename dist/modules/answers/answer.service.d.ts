import { CreateAnswerDTO } from "../../types/index.js";
export declare class AnswerService {
    private repository;
    constructor();
    getAnswersByQuestionId(questionId: number): Promise<{
        id_answer: number;
        points: number | null;
        desc: string | null;
        id_question: number;
    }[]>;
    createAnswer(questionId: number, data: CreateAnswerDTO): Promise<import("../../types/index.js").AnswerDTO>;
}
//# sourceMappingURL=answer.service.d.ts.map
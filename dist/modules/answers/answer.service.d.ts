import { CreateAnswerDTO } from "../../types/index.js";
export declare class AnswerService {
    private repository;
    constructor();
    getAnswersByQuestionId(questionId: number): Promise<{
        id_answer: number;
        id_question: number;
        content: string;
        is_correct: boolean;
    }[]>;
    createAnswer(questionId: number, data: CreateAnswerDTO): Promise<import("../../types/index.js").AnswerDTO>;
    updateAnswer(id: number, data: Partial<CreateAnswerDTO>): Promise<import("../../types/index.js").AnswerDTO>;
    deleteAnswer(id: number): Promise<void>;
}
//# sourceMappingURL=answer.service.d.ts.map
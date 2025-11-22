import { AnswerDTO, CreateAnswerDTO } from "../../types/index.js";
export declare class AnswerRepository {
    findByQuestionId(questionId: number): Promise<{
        id_answer: number;
        points: number | null;
        desc: string | null;
        id_question: number;
    }[]>;
    create(data: CreateAnswerDTO & {
        id_question: number;
    }): Promise<AnswerDTO>;
}
//# sourceMappingURL=answer.repository.d.ts.map
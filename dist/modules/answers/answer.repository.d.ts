import { AnswerDTO, CreateAnswerDTO } from "../../types/index.js";
export declare class AnswerRepository {
    findByQuestionId(questionId: number): Promise<{
        id_answer: number;
        id_question: number;
        content: string;
        is_correct: boolean;
    }[]>;
    findById(id: number): Promise<({
        question: {
            id_question: number;
            id_quiz: number;
            content: string;
            points: number | null;
            order: number | null;
        };
    } & {
        id_answer: number;
        id_question: number;
        content: string;
        is_correct: boolean;
    }) | null>;
    create(data: CreateAnswerDTO): Promise<AnswerDTO>;
    update(id: number, data: Partial<CreateAnswerDTO>): Promise<AnswerDTO>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=answer.repository.d.ts.map
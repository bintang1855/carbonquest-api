import { CreateQuestionDTO, QuestionDTO } from "../../types/index.js";
export declare class QuestionRepository {
    findAll(): Promise<({
        answers: {
            id_answer: number;
            points: number | null;
            desc: string | null;
            id_question: number;
        }[];
    } & {
        id_question: number;
        points: number | null;
        content: string | null;
        category: string | null;
    })[]>;
    findById(id: number): Promise<({
        answers: {
            id_answer: number;
            points: number | null;
            desc: string | null;
            id_question: number;
        }[];
    } & {
        id_question: number;
        points: number | null;
        content: string | null;
        category: string | null;
    }) | null>;
    create(data: CreateQuestionDTO): Promise<QuestionDTO>;
}
//# sourceMappingURL=question.repository.d.ts.map
import { CreateQuestionDTO } from "../../types/index.js";
export declare class QuestionService {
    private repository;
    constructor();
    getAllQuestions(): Promise<({
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
    createQuestion(data: CreateQuestionDTO): Promise<import("../../types/index.js").QuestionDTO>;
    getQuestionById(id: number): Promise<{
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
    }>;
    updateQuestion(id: number, data: Partial<CreateQuestionDTO>): Promise<import("../../types/index.js").QuestionDTO>;
    deleteQuestion(id: number): Promise<void>;
}
//# sourceMappingURL=question.service.d.ts.map
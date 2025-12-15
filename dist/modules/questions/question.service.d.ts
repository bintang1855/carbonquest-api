import { CreateQuestionDTO } from "../../types/index.js";
export declare class QuestionService {
    private repository;
    constructor();
    getAllQuestions(): Promise<({
        answers: {
            id_answer: number;
            id_question: number;
            content: string;
            is_correct: boolean;
        }[];
        quiz: {
            id_quiz: number;
            title: string;
            category: string | null;
            total_points: number | null;
            id_creator: number;
            created_at: Date | null;
        };
    } & {
        id_question: number;
        id_quiz: number;
        content: string;
        points: number | null;
        order: number | null;
    })[]>;
    getQuestionsByQuizId(id_quiz: number): Promise<({
        answers: {
            id_answer: number;
            id_question: number;
            content: string;
            is_correct: boolean;
        }[];
    } & {
        id_question: number;
        id_quiz: number;
        content: string;
        points: number | null;
        order: number | null;
    })[]>;
    createQuestion(data: CreateQuestionDTO): Promise<import("../../types/index.js").QuestionDTO>;
    getQuestionById(id: number): Promise<{
        answers: {
            id_answer: number;
            id_question: number;
            content: string;
            is_correct: boolean;
        }[];
        quiz: {
            id_quiz: number;
            title: string;
            category: string | null;
            total_points: number | null;
            id_creator: number;
            created_at: Date | null;
        };
    } & {
        id_question: number;
        id_quiz: number;
        content: string;
        points: number | null;
        order: number | null;
    }>;
    updateQuestion(id: number, data: Partial<CreateQuestionDTO>): Promise<import("../../types/index.js").QuestionDTO>;
    deleteQuestion(id: number): Promise<void>;
}
//# sourceMappingURL=question.service.d.ts.map
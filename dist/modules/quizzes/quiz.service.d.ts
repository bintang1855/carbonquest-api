import { CreateQuizDTO } from "../../types/index.js";
export declare class QuizService {
    private repository;
    constructor();
    getAllQuizzes(): Promise<{
        question_count: number;
        creator: {
            id_organisasi: number;
            name: string;
            email: string;
            password: string;
            desc: string | null;
        };
        questions: ({
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
        })[];
        id_quiz: number;
        title: string;
        category: string | null;
        total_points: number | null;
        id_creator: number;
        created_at: Date | null;
    }[]>;
    getQuizById(id: number): Promise<{
        creator: {
            id_organisasi: number;
            name: string;
            email: string;
            password: string;
            desc: string | null;
        };
        questions: ({
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
        })[];
    } & {
        id_quiz: number;
        title: string;
        category: string | null;
        total_points: number | null;
        id_creator: number;
        created_at: Date | null;
    }>;
    createQuiz(data: CreateQuizDTO, creatorId: number): Promise<import("../../types/index.js").QuizDTO>;
    updateQuiz(id: number, data: Partial<CreateQuizDTO>): Promise<import("../../types/index.js").QuizDTO>;
    deleteQuiz(id: number): Promise<void>;
}
//# sourceMappingURL=quiz.service.d.ts.map
import { CreateQuizDTO, QuizDTO } from "../../types/index.js";
export declare class QuizRepository {
    findAll(): Promise<({
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
    })[]>;
    findById(id: number): Promise<({
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
    }) | null>;
    create(data: CreateQuizDTO & {
        id_creator: number;
    }): Promise<QuizDTO>;
    update(id: number, data: Partial<CreateQuizDTO>): Promise<QuizDTO>;
    delete(id: number): Promise<void>;
    getQuestionCount(id_quiz: number): Promise<number>;
}
//# sourceMappingURL=quiz.repository.d.ts.map
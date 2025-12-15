import { CreateQuestionDTO, QuestionDTO } from "../../types/index.js";
export declare class QuestionRepository {
    findAll(): Promise<({
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
    findById(id: number): Promise<({
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
    }) | null>;
    findByQuizId(id_quiz: number): Promise<({
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
    create(data: CreateQuestionDTO): Promise<QuestionDTO>;
    update(id: number, data: Partial<CreateQuestionDTO>): Promise<QuestionDTO>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=question.repository.d.ts.map
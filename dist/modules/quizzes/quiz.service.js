import { QuizRepository } from "./quiz.repository.js";
export class QuizService {
    repository;
    constructor() {
        this.repository = new QuizRepository();
    }
    async getAllQuizzes() {
        const quizzes = await this.repository.findAll();
        // Add question count to each quiz
        return await Promise.all(quizzes.map(async (quiz) => ({
            ...quiz,
            question_count: await this.repository.getQuestionCount(quiz.id_quiz),
        })));
    }
    async getQuizById(id) {
        const quiz = await this.repository.findById(id);
        if (!quiz) {
            throw new Error("Quiz not found");
        }
        return quiz;
    }
    async createQuiz(data, creatorId) {
        return await this.repository.create({
            ...data,
            id_creator: creatorId,
        });
    }
    async updateQuiz(id, data) {
        await this.getQuizById(id);
        return await this.repository.update(id, data);
    }
    async deleteQuiz(id) {
        await this.getQuizById(id);
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=quiz.service.js.map
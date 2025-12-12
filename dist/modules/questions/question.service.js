import { QuestionRepository } from "./question.repository.js";
export class QuestionService {
    repository;
    constructor() {
        this.repository = new QuestionRepository();
    }
    async getAllQuestions() {
        return await this.repository.findAll();
    }
    async createQuestion(data) {
        return await this.repository.create(data);
    }
    async getQuestionById(id) {
        const question = await this.repository.findById(id);
        if (!question) {
            throw new Error("Question not found");
        }
        return question;
    }
    async updateQuestion(id, data) {
        // Check if question exists
        await this.getQuestionById(id);
        return await this.repository.update(id, data);
    }
    async deleteQuestion(id) {
        // Check if question exists
        await this.getQuestionById(id);
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=question.service.js.map
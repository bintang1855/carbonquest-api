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
}
//# sourceMappingURL=question.service.js.map
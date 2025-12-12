import { AnswerRepository } from "./answer.repository.js";
export class AnswerService {
    repository;
    constructor() {
        this.repository = new AnswerRepository();
    }
    async getAnswersByQuestionId(questionId) {
        return await this.repository.findByQuestionId(questionId);
    }
    async createAnswer(questionId, data) {
        return await this.repository.create({
            ...data,
            id_question: questionId,
        });
    }
}
//# sourceMappingURL=answer.service.js.map
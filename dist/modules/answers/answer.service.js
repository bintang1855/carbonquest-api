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
    async updateAnswer(id, data) {
        const answer = await this.repository.findById(id);
        if (!answer) {
            throw new Error("Answer not found");
        }
        return await this.repository.update(id, data);
    }
    async deleteAnswer(id) {
        const answer = await this.repository.findById(id);
        if (!answer) {
            throw new Error("Answer not found");
        }
        await this.repository.delete(id);
    }
}
//# sourceMappingURL=answer.service.js.map
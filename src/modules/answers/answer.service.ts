import { CreateAnswerDTO } from "../../types/index.js";
import { AnswerRepository } from "./answer.repository.js";

export class AnswerService {
  private repository: AnswerRepository;

  constructor() {
    this.repository = new AnswerRepository();
  }

  async getAnswersByQuestionId(questionId: number) {
    return await this.repository.findByQuestionId(questionId);
  }

  async createAnswer(questionId: number, data: CreateAnswerDTO) {
    return await this.repository.create({
      ...data,
      id_question: questionId,
    });
  }

  async updateAnswer(id: number, data: Partial<CreateAnswerDTO>) {
    const answer = await this.repository.findById(id);
    if (!answer) {
      throw new Error("Answer not found");
    }
    return await this.repository.update(id, data);
  }

  async deleteAnswer(id: number) {
    const answer = await this.repository.findById(id);
    if (!answer) {
      throw new Error("Answer not found");
    }
    await this.repository.delete(id);
  }
}

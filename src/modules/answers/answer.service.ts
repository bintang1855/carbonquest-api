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
}

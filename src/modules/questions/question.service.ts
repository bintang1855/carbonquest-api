import { CreateQuestionDTO } from "../../types/index.js";
import { QuestionRepository } from "./question.repository.js";

export class QuestionService {
  private repository: QuestionRepository;

  constructor() {
    this.repository = new QuestionRepository();
  }

  async getAllQuestions() {
    return await this.repository.findAll();
  }

  async createQuestion(data: CreateQuestionDTO) {
    return await this.repository.create(data);
  }
}

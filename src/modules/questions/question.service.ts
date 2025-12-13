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

  async getQuestionsByQuizId(id_quiz: number) {
    return await this.repository.findByQuizId(id_quiz);
  }

  async createQuestion(data: CreateQuestionDTO) {
    return await this.repository.create(data);
  }

  async getQuestionById(id: number) {
    const question = await this.repository.findById(id);
    if (!question) {
      throw new Error("Question not found");
    }
    return question;
  }

  async updateQuestion(id: number, data: Partial<CreateQuestionDTO>) {
    // Check if question exists
    await this.getQuestionById(id);
    return await this.repository.update(id, data);
  }

  async deleteQuestion(id: number) {
    // Check if question exists
    await this.getQuestionById(id);
    await this.repository.delete(id);
  }
}

import prisma from "../../prisma/client.js";
import { AnswerDTO, CreateAnswerDTO } from "../../types/index.js";

export class AnswerRepository {
  async findByQuestionId(questionId: number) {
    return await prisma.answers.findMany({
      where: { id_question: questionId },
    });
  }

  async create(
    data: CreateAnswerDTO & { id_question: number }
  ): Promise<AnswerDTO> {
    return await prisma.answers.create({
      data,
    });
  }
}

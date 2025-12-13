import prisma from "../../prisma/client.js";
import { AnswerDTO, CreateAnswerDTO } from "../../types/index.js";

export class AnswerRepository {
  async findByQuestionId(questionId: number) {
    return await prisma.answers.findMany({
      where: { id_question: questionId },
    });
  }

  async findById(id: number) {
    return await prisma.answers.findUnique({
      where: { id_answer: id },
      include: { question: true },
    });
  }

  async create(data: CreateAnswerDTO): Promise<AnswerDTO> {
    return await prisma.answers.create({
      data,
    });
  }

  async update(id: number, data: Partial<CreateAnswerDTO>): Promise<AnswerDTO> {
    return await prisma.answers.update({
      where: { id_answer: id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.answers.delete({
      where: { id_answer: id },
    });
  }
}

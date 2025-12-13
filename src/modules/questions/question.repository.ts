import prisma from "../../prisma/client.js";
import { CreateQuestionDTO, QuestionDTO } from "../../types/index.js";

export class QuestionRepository {
  async findAll() {
    return await prisma.questions.findMany({
      include: {
        answers: true,
        quiz: true,
      },
    });
  }

  async findById(id: number) {
    return await prisma.questions.findUnique({
      where: { id_question: id },
      include: {
        answers: true,
        quiz: true,
      },
    });
  }

  async findByQuizId(id_quiz: number) {
    return await prisma.questions.findMany({
      where: { id_quiz },
      include: { answers: true },
      orderBy: { order: "asc" },
    });
  }

  async create(data: CreateQuestionDTO): Promise<QuestionDTO> {
    return await prisma.questions.create({
      data,
    });
  }

  async update(
    id: number,
    data: Partial<CreateQuestionDTO>
  ): Promise<QuestionDTO> {
    return await prisma.questions.update({
      where: { id_question: id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.questions.delete({
      where: { id_question: id },
    });
  }
}

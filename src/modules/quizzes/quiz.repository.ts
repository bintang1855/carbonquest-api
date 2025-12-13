import prisma from "../../prisma/client.js";
import { CreateQuizDTO, QuizDTO } from "../../types/index.js";

export class QuizRepository {
  async findAll() {
    return await prisma.quizzes.findMany({
      include: {
        creator: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await prisma.quizzes.findUnique({
      where: { id_quiz: id },
      include: {
        creator: true,
        questions: {
          include: {
            answers: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  }

  async create(data: CreateQuizDTO & { id_creator: number }): Promise<QuizDTO> {
    return await prisma.quizzes.create({
      data: {
        ...data,
        created_at: new Date(),
      },
    });
  }

  async update(id: number, data: Partial<CreateQuizDTO>): Promise<QuizDTO> {
    return await prisma.quizzes.update({
      where: { id_quiz: id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.quizzes.delete({
      where: { id_quiz: id },
    });
  }

  async getQuestionCount(id_quiz: number): Promise<number> {
    return await prisma.questions.count({
      where: { id_quiz },
    });
  }
}

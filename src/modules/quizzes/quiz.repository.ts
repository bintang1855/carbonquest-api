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
        title: data.title,
        category: data.category,
        total_points: data.total_points,
        id_creator: data.id_creator,
        created_at: new Date(),
      },
    });
  }

  async createWithQuestions(data: CreateQuizDTO & { id_creator: number }) {
    // Create quiz with nested questions and answers
    return await prisma.quizzes.create({
      data: {
        title: data.title,
        category: data.category,
        total_points: data.total_points,
        id_creator: data.id_creator,
        created_at: new Date(),
        questions: {
          create: data.questions?.map((q, index) => ({
            content: q.content,
            points: q.points || 10,
            order: q.order || index + 1,
            answers: {
              create: q.answers.map((a) => ({
                content: a.content,
                is_correct: a.is_correct,
              })),
            },
          })),
        },
      },
      include: {
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

  async update(id: number, data: Partial<CreateQuizDTO>): Promise<QuizDTO> {
    return await prisma.quizzes.update({
      where: { id_quiz: id },
      data: {
        title: data.title,
        category: data.category,
        total_points: data.total_points,
      },
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

  async findAnswerById(id_answer: number) {
    return await prisma.answers.findUnique({
      where: { id_answer },
      include: {
        question: {
          include: {
            answers: true,
          },
        },
      },
    });
  }
}

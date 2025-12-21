import prisma from "../prisma/client.js";
import {
  CreateQuizDTO,
  QuizDTO,
  UpdateQuizWithQuestionsDTO,
} from "../types/index.js";

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

  async updateWithQuestions(id: number, data: UpdateQuizWithQuestionsDTO) {
    // First, update quiz metadata
    await prisma.quizzes.update({
      where: { id_quiz: id },
      data: {
        title: data.title,
        category: data.category,
        total_points: data.total_points,
      },
    });

    // Get all existing question IDs for this quiz
    const existingQuestions = await prisma.questions.findMany({
      where: { id_quiz: id },
      select: { id_question: true },
    });
    const existingQuestionIds = existingQuestions.map((q) => q.id_question);

    // Track which questions are being updated/kept
    const updatedQuestionIds: number[] = [];

    // Process each question
    if (data.questions) {
      for (const [index, q] of data.questions.entries()) {
        if (q.id_question) {
          // Check if question exists before updating
          const existingQuestion = await prisma.questions.findUnique({
            where: { id_question: q.id_question },
          });

          if (!existingQuestion) {
            throw new Error(`Question with id ${q.id_question} not found`);
          }

          // Update existing question
          updatedQuestionIds.push(q.id_question);

          await prisma.questions.update({
            where: { id_question: q.id_question },
            data: {
              content: q.content,
              points: q.points,
              order: q.order || index + 1,
            },
          });

          // Get existing answer IDs for this question
          const existingAnswers = await prisma.answers.findMany({
            where: { id_question: q.id_question },
            select: { id_answer: true },
          });
          const existingAnswerIds = existingAnswers.map((a) => a.id_answer);
          const updatedAnswerIds: number[] = [];

          // Process answers
          for (const a of q.answers) {
            if (a.id_answer) {
              // Check if answer exists before updating
              const existingAnswer = await prisma.answers.findUnique({
                where: { id_answer: a.id_answer },
              });

              if (existingAnswer) {
                // Update existing answer only if it exists
                updatedAnswerIds.push(a.id_answer);
                await prisma.answers.update({
                  where: { id_answer: a.id_answer },
                  data: {
                    content: a.content,
                    is_correct: a.is_correct,
                  },
                });
              } else {
                // Create new answer if id_answer doesn't exist (treat as new)
                await prisma.answers.create({
                  data: {
                    id_question: q.id_question,
                    content: a.content,
                    is_correct: a.is_correct,
                  },
                });
              }
            } else {
              // Create new answer
              await prisma.answers.create({
                data: {
                  id_question: q.id_question,
                  content: a.content,
                  is_correct: a.is_correct,
                },
              });
            }
          }

          // Delete answers that are no longer present
          const answersToDelete = existingAnswerIds.filter(
            (id) => !updatedAnswerIds.includes(id)
          );
          if (answersToDelete.length > 0) {
            await prisma.answers.deleteMany({
              where: {
                id_answer: { in: answersToDelete },
              },
            });
          }
        } else {
          // Create new question with answers
          await prisma.questions.create({
            data: {
              id_quiz: id,
              content: q.content,
              points: q.points || 10,
              order: q.order || index + 1,
              answers: {
                create: q.answers.map((a) => ({
                  content: a.content,
                  is_correct: a.is_correct,
                })),
              },
            },
          });
        }
      }
    }

    // Delete questions that are no longer present
    const questionsToDelete = existingQuestionIds.filter(
      (id) => !updatedQuestionIds.includes(id)
    );
    if (questionsToDelete.length > 0) {
      await prisma.questions.deleteMany({
        where: {
          id_question: { in: questionsToDelete },
        },
      });
    }

    // Return updated quiz with all relations
    return await this.findById(id);
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

import prisma from "../prisma/client.js";
import {
  CreateQuizDTO,
  QuizDTO,
  UpdateQuizWithQuestionsDTO,
  UpdateQuizQuestionDTO,
  UpdateQuizAnswerDTO,
} from "../types/index.js";

export class QuizRepository {
  async findAll() {
    return await prisma.quizzes.findMany({
      include: {
        creator: true,
        questions: {
          include: { answers: true },
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
          include: { answers: true },
          orderBy: { order: "asc" },
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
                points: a.points || 0,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { answers: true },
          orderBy: { order: "asc" },
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
    await this.updateQuizMetadata(id, data);

    if (data.questions) {
      const existingQuestionIds = await this.getExistingQuestionIds(id);
      const updatedQuestionIds = await this.processQuestions(id, data.questions);
      await this.deleteRemovedQuestions(existingQuestionIds, updatedQuestionIds);
    }

    return await this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await prisma.quizzes.delete({ where: { id_quiz: id } });
  }

  async getQuestionCount(id_quiz: number): Promise<number> {
    return await prisma.questions.count({ where: { id_quiz } });
  }

  async findAnswerById(id_answer: number) {
    return await prisma.answers.findUnique({
      where: { id_answer },
      include: {
        question: {
          include: { answers: true },
        },
      },
    });
  }

  // ==================== Private Helper Methods ====================

  private async updateQuizMetadata(id: number, data: UpdateQuizWithQuestionsDTO) {
    await prisma.quizzes.update({
      where: { id_quiz: id },
      data: {
        title: data.title,
        category: data.category,
        total_points: data.total_points,
      },
    });
  }

  private async getExistingQuestionIds(quizId: number): Promise<number[]> {
    const questions = await prisma.questions.findMany({
      where: { id_quiz: quizId },
      select: { id_question: true },
    });
    return questions.map((q) => q.id_question);
  }

  private async processQuestions(
    quizId: number,
    questions: UpdateQuizQuestionDTO[]
  ): Promise<number[]> {
    const updatedIds: number[] = [];

    for (const [index, question] of questions.entries()) {
      if (question.id_question) {
        await this.updateExistingQuestion(question, index);
        updatedIds.push(question.id_question);
      } else {
        await this.createNewQuestion(quizId, question, index);
      }
    }

    return updatedIds;
  }

  private async updateExistingQuestion(
    question: UpdateQuizQuestionDTO,
    index: number
  ): Promise<void> {
    const exists = await prisma.questions.findUnique({
      where: { id_question: question.id_question },
    });

    if (!exists) {
      throw new Error(`Question with id ${question.id_question} not found`);
    }

    await prisma.questions.update({
      where: { id_question: question.id_question },
      data: {
        content: question.content,
        points: question.points,
        order: question.order || index + 1,
      },
    });

    await this.processAnswers(question.id_question!, question.answers);
  }

  private async createNewQuestion(
    quizId: number,
    question: UpdateQuizQuestionDTO,
    index: number
  ): Promise<void> {
    await prisma.questions.create({
      data: {
        id_quiz: quizId,
        content: question.content,
        points: question.points || 10,
        order: question.order || index + 1,
        answers: {
          create: question.answers.map((a) => ({
            content: a.content,
            points: a.points || 0,
          })),
        },
      },
    });
  }

  private async processAnswers(
    questionId: number,
    answers: UpdateQuizAnswerDTO[]
  ): Promise<void> {
    const existingAnswerIds = await this.getExistingAnswerIds(questionId);
    const updatedAnswerIds: number[] = [];

    for (const answer of answers) {
      if (answer.id_answer) {
        const updated = await this.updateOrCreateAnswer(questionId, answer);
        if (updated) updatedAnswerIds.push(answer.id_answer);
      } else {
        await this.createAnswer(questionId, answer);
      }
    }

    await this.deleteRemovedAnswers(existingAnswerIds, updatedAnswerIds);
  }

  private async getExistingAnswerIds(questionId: number): Promise<number[]> {
    const answers = await prisma.answers.findMany({
      where: { id_question: questionId },
      select: { id_answer: true },
    });
    return answers.map((a) => a.id_answer);
  }

  private async updateOrCreateAnswer(
    questionId: number,
    answer: UpdateQuizAnswerDTO
  ): Promise<boolean> {
    const exists = await prisma.answers.findUnique({
      where: { id_answer: answer.id_answer },
    });

    if (exists) {
      await prisma.answers.update({
        where: { id_answer: answer.id_answer },
        data: { content: answer.content, points: answer.points || 0 },
      });
      return true;
    }

    await this.createAnswer(questionId, answer);
    return false;
  }

  private async createAnswer(
    questionId: number,
    answer: UpdateQuizAnswerDTO
  ): Promise<void> {
    await prisma.answers.create({
      data: {
        id_question: questionId,
        content: answer.content,
        points: answer.points || 0,
      },
    });
  }

  private async deleteRemovedQuestions(
    existing: number[],
    updated: number[]
  ): Promise<void> {
    const toDelete = existing.filter((id) => !updated.includes(id));
    if (toDelete.length > 0) {
      await prisma.questions.deleteMany({
        where: { id_question: { in: toDelete } },
      });
    }
  }

  private async deleteRemovedAnswers(
    existing: number[],
    updated: number[]
  ): Promise<void> {
    const toDelete = existing.filter((id) => !updated.includes(id));
    if (toDelete.length > 0) {
      await prisma.answers.deleteMany({
        where: { id_answer: { in: toDelete } },
      });
    }
  }
}

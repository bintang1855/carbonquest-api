import prisma from "../../prisma/client.js";
import { CreateQuestionDTO, QuestionDTO } from "../../types/index.js";

export class QuestionRepository {
  async findAll() {
    return await prisma.questions.findMany({
      include: { answers: true },
    });
  }

  async findById(id: number) {
    return await prisma.questions.findUnique({
      where: { id_question: id },
      include: { answers: true },
    });
  }

  async create(data: CreateQuestionDTO): Promise<QuestionDTO> {
    return await prisma.questions.create({
      data,
    });
  }
}

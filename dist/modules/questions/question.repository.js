import prisma from "../../prisma/client.js";
export class QuestionRepository {
    async findAll() {
        return await prisma.questions.findMany({
            include: { answers: true },
        });
    }
    async findById(id) {
        return await prisma.questions.findUnique({
            where: { id_question: id },
            include: { answers: true },
        });
    }
    async create(data) {
        return await prisma.questions.create({
            data,
        });
    }
}
//# sourceMappingURL=question.repository.js.map
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
    async update(id, data) {
        return await prisma.questions.update({
            where: { id_question: id },
            data,
        });
    }
    async delete(id) {
        await prisma.questions.delete({
            where: { id_question: id },
        });
    }
}
//# sourceMappingURL=question.repository.js.map
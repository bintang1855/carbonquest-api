import prisma from "../../prisma/client.js";
export class AnswerRepository {
    async findByQuestionId(questionId) {
        return await prisma.answers.findMany({
            where: { id_question: questionId },
        });
    }
    async findById(id) {
        return await prisma.answers.findUnique({
            where: { id_answer: id },
            include: { question: true },
        });
    }
    async create(data) {
        return await prisma.answers.create({
            data,
        });
    }
    async update(id, data) {
        return await prisma.answers.update({
            where: { id_answer: id },
            data,
        });
    }
    async delete(id) {
        await prisma.answers.delete({
            where: { id_answer: id },
        });
    }
}
//# sourceMappingURL=answer.repository.js.map
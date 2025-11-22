import prisma from "../../prisma/client.js";
export class AnswerRepository {
    async findByQuestionId(questionId) {
        return await prisma.answers.findMany({
            where: { id_question: questionId },
        });
    }
    async create(data) {
        return await prisma.answers.create({
            data,
        });
    }
}
//# sourceMappingURL=answer.repository.js.map
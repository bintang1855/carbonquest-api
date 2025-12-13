import prisma from "../../prisma/client.js";
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
    async findById(id) {
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
    async create(data) {
        return await prisma.quizzes.create({
            data: {
                ...data,
                created_at: new Date(),
            },
        });
    }
    async update(id, data) {
        return await prisma.quizzes.update({
            where: { id_quiz: id },
            data,
        });
    }
    async delete(id) {
        await prisma.quizzes.delete({
            where: { id_quiz: id },
        });
    }
    async getQuestionCount(id_quiz) {
        return await prisma.questions.count({
            where: { id_quiz },
        });
    }
}
//# sourceMappingURL=quiz.repository.js.map
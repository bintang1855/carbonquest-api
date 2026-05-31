/*
  Warnings:

  - You are about to drop the column `desc` on the `Answers` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Answers` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Questions` table. All the data in the column will be lost.
  - Added the required column `content` to the `Answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_quiz` to the `Questions` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Questions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_id_question_fkey";

-- AlterTable
ALTER TABLE "Answers" DROP COLUMN "desc",
DROP COLUMN "points",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "is_correct" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Questions" DROP COLUMN "category",
ADD COLUMN     "id_quiz" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER,
ALTER COLUMN "points" SET DEFAULT 10,
ALTER COLUMN "content" SET NOT NULL;

-- CreateTable
CREATE TABLE "Quizzes" (
    "id_quiz" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100),
    "total_points" INTEGER DEFAULT 0,
    "id_creator" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quizzes_pkey" PRIMARY KEY ("id_quiz")
);

-- AddForeignKey
ALTER TABLE "Quizzes" ADD CONSTRAINT "Quizzes_id_creator_fkey" FOREIGN KEY ("id_creator") REFERENCES "Organization"("id_organisasi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_id_quiz_fkey" FOREIGN KEY ("id_quiz") REFERENCES "Quizzes"("id_quiz") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "Questions"("id_question") ON DELETE CASCADE ON UPDATE CASCADE;

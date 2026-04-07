-- Add points to Answers for quiz scoring
-- Existing DB (from previous migration) has: id_answer, id_question, content, is_correct

ALTER TABLE "Answers"
ADD COLUMN "points" INTEGER NOT NULL DEFAULT 0;

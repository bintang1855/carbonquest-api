-- Add missing session fields used by the app

ALTER TABLE "Sessions"
ADD COLUMN "session_type" VARCHAR(50),
ADD COLUMN "id_quiz" INTEGER;

ALTER TABLE "Sessions"
ADD CONSTRAINT "Sessions_id_quiz_fkey"
FOREIGN KEY ("id_quiz") REFERENCES "Quizzes"("id_quiz")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Add new columns to Sessions table
ALTER TABLE "Sessions" 
ADD COLUMN "session_type" VARCHAR(50),
ADD COLUMN "id_quiz" INTEGER;

-- Add foreign key constraint for id_quiz
ALTER TABLE "Sessions"
ADD CONSTRAINT "Sessions_id_quiz_fkey" 
FOREIGN KEY ("id_quiz") 
REFERENCES "Quizzes"("id_quiz") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Create index for better query performance
CREATE INDEX "Sessions_id_quiz_idx" ON "Sessions"("id_quiz");
CREATE INDEX "Sessions_session_type_idx" ON "Sessions"("session_type");
CREATE INDEX "Sessions_end_time_idx" ON "Sessions"("end_time");

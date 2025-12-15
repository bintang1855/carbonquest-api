-- Add CASCADE delete for Sessions foreign keys

-- Drop existing foreign key constraints
ALTER TABLE "Sessions" DROP CONSTRAINT IF EXISTS "Sessions_id_user_fkey";
ALTER TABLE "Sessions" DROP CONSTRAINT IF EXISTS "Sessions_id_answer_fkey";
ALTER TABLE "Sessions" DROP CONSTRAINT IF EXISTS "Sessions_id_quiz_fkey";

-- Recreate with proper CASCADE/SET NULL behavior
ALTER TABLE "Sessions"
ADD CONSTRAINT "Sessions_id_user_fkey" 
FOREIGN KEY ("id_user") 
REFERENCES "Users"("id_user") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

ALTER TABLE "Sessions"
ADD CONSTRAINT "Sessions_id_answer_fkey" 
FOREIGN KEY ("id_answer") 
REFERENCES "Answers"("id_answer") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

ALTER TABLE "Sessions"
ADD CONSTRAINT "Sessions_id_quiz_fkey" 
FOREIGN KEY ("id_quiz") 
REFERENCES "Quizzes"("id_quiz") 
ON DELETE SET NULL 
ON UPDATE CASCADE;

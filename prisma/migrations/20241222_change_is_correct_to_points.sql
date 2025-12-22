-- Migration: Change is_correct to points for quiz answers
-- This migration converts existing data: is_correct=true -> points=10, is_correct=false -> points=0

-- Step 1: Add new points column with default value
ALTER TABLE "Answers" ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- Step 2: Migrate existing data based on is_correct value
-- Answers marked as correct get 10 points, incorrect get 0 points
UPDATE "Answers" SET points = CASE WHEN is_correct = true THEN 10 ELSE 0 END;

-- Step 3: Drop the old is_correct column
ALTER TABLE "Answers" DROP COLUMN IF EXISTS is_correct;

-- Step 4: Set NOT NULL constraint on points (optional, matches schema)
ALTER TABLE "Answers" ALTER COLUMN points SET NOT NULL;
ALTER TABLE "Answers" ALTER COLUMN points SET DEFAULT 0;

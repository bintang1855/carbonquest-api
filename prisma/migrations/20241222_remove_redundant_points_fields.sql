-- Migration: Remove total_points from Quizzes and points from Questions
-- These fields are no longer needed since scoring is now per-answer

-- Step 1: Drop points column from Questions table
ALTER TABLE "Questions" DROP COLUMN IF EXISTS points;

-- Step 2: Drop total_points column from Quizzes table
ALTER TABLE "Quizzes" DROP COLUMN IF EXISTS total_points;

-- CreateTable
CREATE TABLE "Users" (
    "id_user" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "birth_date" TIMESTAMP(3),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(100) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id_organisasi" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "desc" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id_organisasi")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id_question" SERIAL NOT NULL,
    "points" INTEGER,
    "content" TEXT,
    "category" VARCHAR(100),

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id_question")
);

-- CreateTable
CREATE TABLE "Answers" (
    "id_answer" SERIAL NOT NULL,
    "points" INTEGER,
    "desc" TEXT,
    "id_question" INTEGER NOT NULL,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("id_answer")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id_session" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "total_points" INTEGER,
    "id_user" INTEGER NOT NULL,
    "id_answer" INTEGER NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id_session")
);

-- CreateTable
CREATE TABLE "Missions" (
    "id_mission" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "tags" VARCHAR(255),
    "desc" TEXT,
    "cover_image" VARCHAR(255),
    "photo_caption" VARCHAR(255),
    "author_name" VARCHAR(100),
    "author_role" VARCHAR(50),
    "points" INTEGER,
    "highlights" TEXT,
    "date_created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "id_creator" INTEGER NOT NULL,

    CONSTRAINT "Missions_pkey" PRIMARY KEY ("id_mission")
);

-- CreateTable
CREATE TABLE "User_Missions" (
    "id_working" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_mission" INTEGER NOT NULL,
    "status" VARCHAR(100),
    "points" INTEGER,
    "completed_time" TIMESTAMP(3),

    CONSTRAINT "User_Missions_pkey" PRIMARY KEY ("id_working")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id_article" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "topic" VARCHAR(100),
    "description" TEXT,
    "content" TEXT,
    "cover_image" VARCHAR(255),
    "photo_caption" VARCHAR(255),
    "photo_credit" VARCHAR(100),
    "author_name" VARCHAR(100),
    "author_role" VARCHAR(50),
    "place" VARCHAR(100),
    "highlights" TEXT,
    "date_created" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "id_author" INTEGER NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id_article")
);

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_id_question_fkey" FOREIGN KEY ("id_question") REFERENCES "Questions"("id_question") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_id_answer_fkey" FOREIGN KEY ("id_answer") REFERENCES "Answers"("id_answer") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Missions" ADD CONSTRAINT "Missions_id_creator_fkey" FOREIGN KEY ("id_creator") REFERENCES "Organization"("id_organisasi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Missions" ADD CONSTRAINT "User_Missions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Missions" ADD CONSTRAINT "User_Missions_id_mission_fkey" FOREIGN KEY ("id_mission") REFERENCES "Missions"("id_mission") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_id_author_fkey" FOREIGN KEY ("id_author") REFERENCES "Organization"("id_organisasi") ON DELETE RESTRICT ON UPDATE CASCADE;

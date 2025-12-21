import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CarbonQuest API Documentation",
      version: "1.0.0",
      description:
        "A comprehensive gamification API built with Express, TypeScript, and Prisma",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "https://carbonquest-api.bintangap.my.id",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
            },
            message: {
              type: "string",
              description: "Human-readable message about the operation",
            },
            data: {
              type: "object",
              description: "Response data (if successful)",
            },
            error: {
              type: "string",
              description: "Error details (if failed)",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id_user: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        Organization: {
          type: "object",
          properties: {
            id_organisasi: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            desc: { type: "string", nullable: true },
          },
        },
        Mission: {
          type: "object",
          properties: {
            id_mission: { type: "integer" },
            title: { type: "string" },
            tags: { type: "string", nullable: true },
            desc: { type: "string", nullable: true },
            cover_image: { type: "string", nullable: true },
            photo_caption: { type: "string", nullable: true },
            author_name: { type: "string", nullable: true },
            author_role: { type: "string", nullable: true },
            points: { type: "integer", nullable: true },
            highlights: { type: "string", nullable: true },
            date_created: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            id_creator: { type: "integer" },
          },
        },
        UserMission: {
          type: "object",
          properties: {
            id_working: { type: "integer" },
            id_user: { type: "integer" },
            id_mission: { type: "integer" },
            status: { type: "string", nullable: true },
            points: { type: "integer", nullable: true },
            completed_time: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },
        Question: {
          type: "object",
          properties: {
            id_question: { type: "integer" },
            id_quiz: { type: "integer" },
            content: { type: "string" },
            points: { type: "integer", nullable: true },
            order: { type: "integer", nullable: true },
          },
        },
        Answer: {
          type: "object",
          properties: {
            id_answer: { type: "integer" },
            id_question: { type: "integer" },
            content: { type: "string" },
            is_correct: { type: "boolean" },
          },
        },
        Quiz: {
          type: "object",
          properties: {
            id_quiz: { type: "integer" },
            title: { type: "string" },
            category: { type: "string", nullable: true },
            total_points: { type: "integer", nullable: true },
            id_creator: { type: "integer" },
            created_at: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_question: { type: "integer" },
                  content: { type: "string" },
                  points: { type: "integer" },
                  order: { type: "integer" },
                  answers: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Answer" },
                  },
                },
              },
            },
          },
        },
        CreateQuizWithQuestions: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              example: "Quiz Perubahan Iklim",
            },
            category: {
              type: "string",
              example: "Mingguan",
            },
            total_points: {
              type: "integer",
              example: 100,
            },
            questions: {
              type: "array",
              items: {
                type: "object",
                required: ["content", "answers"],
                properties: {
                  content: {
                    type: "string",
                    example: "Apa penyebab utama perubahan iklim?",
                  },
                  points: {
                    type: "integer",
                    example: 10,
                  },
                  order: {
                    type: "integer",
                    example: 1,
                  },
                  answers: {
                    type: "array",
                    minItems: 2,
                    items: {
                      type: "object",
                      required: ["content", "is_correct"],
                      properties: {
                        content: {
                          type: "string",
                          example: "Emisi gas rumah kaca",
                        },
                        is_correct: {
                          type: "boolean",
                          example: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        SubmitQuizAnswer: {
          type: "object",
          required: ["id_question", "id_answer"],
          properties: {
            id_question: {
              type: "integer",
              example: 1,
              description: "The question being answered",
            },
            id_answer: {
              type: "integer",
              example: 3,
              description: "The answer chosen by the user",
            },
          },
        },
        QuizSubmissionResult: {
          type: "object",
          properties: {
            is_correct: {
              type: "boolean",
              example: true,
              description: "Whether the answer is correct",
            },
            points_earned: {
              type: "integer",
              example: 10,
              description: "Points earned from this answer",
            },
            correct_answer: {
              type: "string",
              example: "Emisi gas rumah kaca",
              nullable: true,
              description:
                "The correct answer (only shown if user answered wrong)",
            },
            session_id: {
              type: "integer",
              example: 1,
              description: "ID of the created session",
            },
          },
        },
        Session: {
          type: "object",
          properties: {
            id_session: { type: "integer" },
            start_time: { type: "string", format: "date-time", nullable: true },
            end_time: { type: "string", format: "date-time", nullable: true },
            total_points: { type: "integer", nullable: true },
            session_type: { type: "string", nullable: true },
            id_user: { type: "integer" },
            id_answer: { type: "integer" },
            id_quiz: { type: "integer", nullable: true },
          },
        },
        WeeklyPoints: {
          type: "object",
          properties: {
            week: {
              type: "string",
              format: "date",
              example: "2024-12-24",
              description:
                "Date in YYYY-MM-DD format (represents a single day)",
            },
            mission_points: {
              type: "integer",
              example: 150,
            },
            quiz_points: {
              type: "integer",
              example: 200,
            },
            total_points: {
              type: "integer",
              example: 350,
            },
            missions_completed: {
              type: "integer",
              example: 3,
            },
            quizzes_completed: {
              type: "integer",
              example: 2,
            },
          },
        },
        Article: {
          type: "object",
          properties: {
            id_article: { type: "integer" },
            title: { type: "string" },
            topic: { type: "string", nullable: true },
            description: { type: "string", nullable: true },
            content: { type: "string", nullable: true },
            cover_image: { type: "string", nullable: true },
            photo_caption: { type: "string", nullable: true },
            photo_credit: { type: "string", nullable: true },
            author_name: { type: "string", nullable: true },
            author_role: { type: "string", nullable: true },
            place: { type: "string", nullable: true },
            highlights: { type: "string", nullable: true },
            date_created: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            id_author: { type: "integer" },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    "./dist/routes/*.routes.js",
    "./dist/app.js",
    // Fallback untuk development
    "./src/routes/*.routes.ts",
    "./src/app.ts",
  ],
};
export const swaggerSpec = swaggerJsdoc(options);

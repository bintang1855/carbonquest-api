import swaggerJsdoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CarbonQuest API Documentation",
            version: "1.0.0",
            description: "A comprehensive gamification API built with Express, TypeScript, and Prisma",
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
                Question: {
                    type: "object",
                    properties: {
                        id_question: { type: "integer" },
                        points: { type: "integer", nullable: true },
                        content: { type: "string", nullable: true },
                        category: { type: "string", nullable: true },
                    },
                },
                Answer: {
                    type: "object",
                    properties: {
                        id_answer: { type: "integer" },
                        points: { type: "integer", nullable: true },
                        desc: { type: "string", nullable: true },
                        id_question: { type: "integer" },
                    },
                },
                Session: {
                    type: "object",
                    properties: {
                        id_session: { type: "integer" },
                        start_time: { type: "string", format: "date-time", nullable: true },
                        end_time: { type: "string", format: "date-time", nullable: true },
                        total_points: { type: "integer", nullable: true },
                        id_user: { type: "integer" },
                        id_answer: { type: "integer" },
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
        "./dist/modules/**/*.routes.js",
        "./dist/app.js",
        // Fallback untuk development
        "./src/modules/**/*.routes.ts",
        "./src/app.ts",
    ],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map
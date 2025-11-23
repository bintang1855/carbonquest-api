import swaggerJsdoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CarbonQuest API 2",
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
                        desc: { type: "string", nullable: true },
                        points: { type: "integer", nullable: true },
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
                        content: { type: "string", nullable: true },
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
        "./src/modules/**/*.routes.ts",
        "./src/modules/**/*.routes.js",
        "./dist/modules/**/*.routes.js",
        "./src/app.ts",
        "./dist/app.js",
    ],
};
export const swaggerSpec = swaggerJsdoc(options);
//# sourceMappingURL=swagger.js.map
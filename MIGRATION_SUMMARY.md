# Project Migration Summary

## Folder Structure

```
carbonquest-test-api/
├── prisma/
│   └── schema.prisma           # Prisma schema (unchanged)
├── src/
│   ├── config/
│   │   └── swagger.ts          # Swagger/OpenAPI configuration
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT authentication & token generation
│   │   └── error.middleware.ts # Global error handler
│   ├── modules/
│   │   ├── answers/
│   │   │   ├── answer.repository.ts
│   │   │   ├── answer.service.ts
│   │   │   └── answer.routes.ts
│   │   ├── articles/
│   │   │   ├── article.repository.ts
│   │   │   ├── article.service.ts
│   │   │   └── article.routes.ts
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── missions/
│   │   │   ├── mission.repository.ts
│   │   │   ├── mission.service.ts
│   │   │   └── mission.routes.ts
│   │   ├── organizations/
│   │   │   ├── organization.repository.ts
│   │   │   ├── organization.service.ts
│   │   │   └── organization.routes.ts
│   │   ├── questions/
│   │   │   ├── question.repository.ts
│   │   │   ├── question.service.ts
│   │   │   └── question.routes.ts
│   │   ├── sessions/
│   │   │   ├── session.repository.ts
│   │   │   ├── session.service.ts
│   │   │   └── session.routes.ts
│   │   ├── user-missions/
│   │   │   ├── user-mission.repository.ts
│   │   │   ├── user-mission.service.ts
│   │   │   └── user-mission.routes.ts
│   │   └── users/
│   │       ├── user.repository.ts
│   │       ├── user.service.ts
│   │       └── user.routes.ts
│   ├── prisma/
│   │   └── client.ts           # Prisma client singleton
│   ├── types/
│   │   └── index.ts            # All TypeScript types/interfaces
│   ├── utils/
│   │   └── response.ts         # Standardized response utilities
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server entry point
├── .env.example                # Environment variables template
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json                # Updated with TypeScript dependencies
├── prisma.config.ts
├── README.md                   # Complete documentation
└── tsconfig.json               # TypeScript configuration
```

## Key Files Overview

### 1. src/server.ts

Entry point that starts the HTTP server.

### 2. src/app.ts

Configures Express app with:

- CORS
- JSON parsing
- Route mounting
- Swagger UI at /docs
- Error handling

### 3. src/prisma/client.ts

Prisma client singleton with proper TypeScript types.

### 4. src/types/index.ts

Contains all TypeScript interfaces:

- ApiResponse<T> - Standardized response format
- JwtPayload - JWT token structure
- AuthenticatedRequest - Extended Express Request
- DTOs for all entities (User, Organization, Mission, etc.)

### 5. src/utils/response.ts

ResponseUtil class with static methods:

- success() - 200 responses
- created() - 201 responses
- badRequest() - 400 responses
- unauthorized() - 401 responses
- forbidden() - 403 responses
- notFound() - 404 responses
- error() - Generic error responses

### 6. src/middleware/auth.middleware.ts

- authMiddleware(requiredRole?) - Validates JWT and checks roles
- generateToken() - Creates JWT tokens

### 7. src/middleware/error.middleware.ts

- AppError class - Custom error with status code
- errorHandler - Global Express error handler

### 8. Module Structure (Example: Users)

**user.repository.ts** - Data Access Layer

```typescript
export class UserRepository {
  async findById(id: number): Promise<UserDTO | null>;
  async findByEmail(email: string): Promise<UserDTO | null>;
  async findAll(): Promise<UserDTO[]>;
  async create(data: CreateUserDTO): Promise<UserDTO>;
}
```

**user.service.ts** - Business Logic Layer

```typescript
export class UserService {
  private repository: UserRepository;

  async getAllUsers(): Promise<UserDTO[]>;
  async getUserById(id: number): Promise<Omit<UserDTO, "password">>;
}
```

**user.routes.ts** - Presentation Layer

```typescript
const router = Router();
const userService = new UserService();

router.get("/", authMiddleware("org"), async (req, res, next) => {
  // Handle request, call service, return response
});

export default router;
```

## Standardized Response Examples

### Success Response (200/201)

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id_user": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response (400/401/403/404/500)

```json
{
  "success": false,
  "message": "Failed to register user",
  "error": "Email already exists"
}
```

## Swagger Documentation Examples

Routes include JSDoc comments for Swagger:

```typescript
/**
 * @openapi
 * /auth/user/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new user account
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 */
```

## All English Messages

All error and success messages have been translated to English:

- ❌ "name, email, password wajib diisi"
- ✅ "Name, email, and password are required"

- ❌ "Email atau password salah"
- ✅ "Invalid email or password"

- ❌ "Gagal register user"
- ✅ "Failed to register user"

## API Endpoints Reference

### Authentication (No Auth Required)

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | /auth/user/register | Register new user         |
| POST   | /auth/user/login    | User login                |
| POST   | /auth/org/register  | Register new organization |
| POST   | /auth/org/login     | Organization login        |

### Users (Auth Required)

| Method | Endpoint   | Role | Description    |
| ------ | ---------- | ---- | -------------- |
| GET    | /users     | org  | Get all users  |
| GET    | /users/:id | any  | Get user by ID |

### Organizations (Auth Required)

| Method | Endpoint       | Role | Description           |
| ------ | -------------- | ---- | --------------------- |
| GET    | /organizations | org  | Get all organizations |

### Missions (Auth Required)

| Method | Endpoint  | Role | Description      |
| ------ | --------- | ---- | ---------------- |
| POST   | /missions | org  | Create mission   |
| GET    | /missions | any  | Get all missions |

### User Missions (Auth Required)

| Method | Endpoint           | Role | Description     |
| ------ | ------------------ | ---- | --------------- |
| POST   | /user-missions     | user | Start mission   |
| PUT    | /user-missions/:id | user | Update mission  |
| GET    | /me/missions       | user | Get my missions |

### Questions (Auth Required)

| Method | Endpoint   | Role | Description       |
| ------ | ---------- | ---- | ----------------- |
| POST   | /questions | org  | Create question   |
| GET    | /questions | any  | Get all questions |

### Answers (Auth Required)

| Method | Endpoint               | Role | Description   |
| ------ | ---------------------- | ---- | ------------- |
| POST   | /questions/:id/answers | org  | Create answer |
| GET    | /questions/:id/answers | any  | Get answers   |

### Sessions (Auth Required)

| Method | Endpoint      | Role | Description     |
| ------ | ------------- | ---- | --------------- |
| POST   | /sessions     | user | Create session  |
| PUT    | /sessions/:id | user | Update session  |
| GET    | /me/sessions  | user | Get my sessions |

### Articles (Auth Required)

| Method | Endpoint  | Role | Description      |
| ------ | --------- | ---- | ---------------- |
| POST   | /articles | org  | Create article   |
| GET    | /articles | any  | Get all articles |

## Running the Project

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment:**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Generate Prisma Client:**

   ```bash
   npm run prisma:generate
   ```

4. **Run migrations:**

   ```bash
   npm run prisma:migrate
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

6. **Access Swagger docs:**
   ```
   http://localhost:4000/docs
   ```

## TypeScript Benefits

✅ Full type safety
✅ Better IDE autocomplete
✅ Compile-time error detection
✅ Easier refactoring
✅ Self-documenting code
✅ Improved maintainability

## Architecture Benefits

✅ **Separation of Concerns** - Each layer has clear responsibility
✅ **Testability** - Easy to unit test each layer independently
✅ **Maintainability** - Changes are isolated to specific layers
✅ **Scalability** - Easy to add new features following same pattern
✅ **Reusability** - Services and repositories can be reused
✅ **Type Safety** - TypeScript throughout the stack

## Next Steps

The project is fully migrated and ready to use. You can:

1. Install dependencies with `npm install`
2. Configure your `.env` file
3. Run `npm run dev` to start the development server
4. Visit `http://localhost:4000/docs` to explore the API

All existing functionality has been preserved and enhanced with TypeScript, better architecture, standardized responses, and comprehensive documentation.

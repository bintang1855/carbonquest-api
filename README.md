# CarbonQuest Gamification API

A comprehensive gamification API built with **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. This API follows a clean **Controller-Service-Repository** layered architecture with standardized responses, file upload support, and complete Swagger documentation.

## 🚀 Features

- ✅ **TypeScript** - Full type safety across the entire codebase
- ✅ **Controller-Service-Repository Architecture** - Clean separation of concerns
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **JWT Authentication** - Secure user and organization authentication
- ✅ **Secure File Upload** - Multer with rate limiting and validation
- ✅ **Rate Limiting** - Upload endpoints (10 req/15min), Auth (5 req/15min), Global (1000 req/min)
- ✅ **Standardized API Responses** - Consistent response format across all endpoints
- ✅ **Swagger Documentation** - Interactive API documentation at `/docs`
- ✅ **Role-Based Access Control** - User and Organization roles with protected endpoints
- ✅ **Docker Support** - Full containerization with Docker Compose
- ✅ **Error Handling** - Centralized error handling with custom AppError class

## 📁 Project Structure

```
src/
├── config/
│   └── swagger.ts              # Swagger/OpenAPI configuration
├── controllers/                 # HTTP request handlers
│   ├── article.controller.ts
│   ├── auth.controller.ts
│   ├── mission.controller.ts
│   ├── organization.controller.ts
│   ├── quiz.controller.ts
│   ├── session.controller.ts
│   ├── user.controller.ts
│   └── user-mission.controller.ts
├── middleware/
│   ├── auth.middleware.ts      # JWT authentication middleware
│   ├── error.middleware.ts     # Global error handling with AppError
│   ├── rate-limit.middleware.ts # Upload rate limiting
│   └── upload.middleware.ts    # File upload middleware (5MB, images only)
├── repositories/                # Data access layer (Prisma queries)
│   ├── article.repository.ts
│   ├── mission.repository.ts
│   ├── organization.repository.ts
│   ├── quiz.repository.ts
│   ├── session.repository.ts
│   ├── user.repository.ts
│   └── user-mission.repository.ts
├── routes/                      # API route definitions with OpenAPI docs
│   ├── article.routes.ts
│   ├── auth.routes.ts
│   ├── file.routes.ts
│   ├── mission.routes.ts
│   ├── organization.routes.ts
│   ├── quiz.routes.ts
│   ├── session.routes.ts
│   ├── user.routes.ts
│   └── user-mission.routes.ts
├── services/                    # Business logic layer
│   ├── article.service.ts
│   ├── auth.service.ts
│   ├── mission.service.ts
│   ├── organization.service.ts
│   ├── quiz.service.ts
│   ├── session.service.ts
│   ├── user.service.ts
│   └── user-mission.service.ts
├── prisma/
│   └── client.ts               # Prisma client singleton
├── types/
│   └── index.ts                # TypeScript DTOs and interfaces
├── utils/
│   ├── helpers.ts              # Utility functions (parseId, removeUndefinedFields, etc.)
│   └── response.ts             # Response utility functions
├── app.ts                      # Express app configuration
└── server.ts                   # Server entry point
```

## 🏗️ Architecture Pattern

### Controller-Service-Repository Pattern

```
HTTP Request
     ↓
┌─────────────────┐
│    ROUTES       │  Routing + OpenAPI documentation
└────────┬────────┘
         ↓
┌─────────────────┐
│   CONTROLLER    │  Handle request/response, input validation
└────────┬────────┘
         ↓
┌─────────────────┐
│    SERVICE      │  Business logic
└────────┬────────┘
         ↓
┌─────────────────┐
│   REPOSITORY    │  Database operations (Prisma)
└────────┬────────┘
         ↓
     Database
```

### Layer Responsibilities

| Layer          | Responsibility                                                   |
| -------------- | ---------------------------------------------------------------- |
| **Routes**     | URL mapping, middleware chain, OpenAPI documentation             |
| **Controller** | Parse request, validate input, call service, send response       |
| **Service**    | Business rules, data transformation, cross-repository operations |
| **Repository** | Database queries, Prisma operations                              |

### Benefits

- ✅ Single responsibility per layer
- ✅ Easier unit testing
- ✅ Reusable business logic
- ✅ Database-agnostic service layer
- ✅ Clean, maintainable codebase

## 🛠️ Installation

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- npm or yarn

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/bintang1855/carbonquest-api.git
cd carbonquest-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/carbonquest?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
PORT=4000
NODE_ENV=development
```

4. **Generate Prisma Client**

```bash
npm run prisma:generate
```

5. **Run database migrations**

```bash
npm run prisma:migrate
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with hot-reload on `http://localhost:4000`

### Production Mode

```bash
npm run build
npm start
```

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Opens on `http://localhost:5555`

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

- **Local:** http://localhost:4000/docs
- **Production:** https://carbonquest-api.bintangap.my.id/docs

## 🔑 Authentication

The API supports two types of authentication:

1. **User Authentication** - Regular users
2. **Organization Authentication** - Organizations/Companies

### Register & Login

#### User Registration

```bash
POST /auth/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "last_name": "Doe",
  "birth_date": "1990-01-01",
  "phone": "081234567890"
}
```

#### User Login

```bash
POST /auth/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Using JWT Tokens

After successful login, include the token in subsequent requests:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📋 API Endpoints

### Health Check

- `GET /` - Check API status

### Authentication

- `POST /auth/user/register` - Register new user
- `POST /auth/user/login` - User login
- `POST /auth/org/register` - Register new organization
- `POST /auth/org/login` - Organization login

### Users

- `GET /users` - Get all users (Organization only)
- `GET /users/leaderboard` - Get user leaderboard with points
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/profile-image` - Upload profile image
- `PUT /users/password` - Update password
- `DELETE /users/:id` - Delete user account

### Organizations

- `GET /organizations` - Get all organizations
- `PUT /organizations/password` - Update organization password

### Quizzes

- `POST /quizzes` - Create quiz with questions & answers
- `GET /quizzes` - Get all quizzes with question counts
- `GET /quizzes/:id` - Get quiz by ID with full details
- `PUT /quizzes/:id` - Update quiz with questions & answers
- `DELETE /quizzes/:id` - Delete quiz
- `POST /quizzes/submit` - Submit quiz answer

### Missions

- `POST /missions` - Create mission with image upload
- `GET /missions` - Get all missions
- `GET /missions/:id` - Get mission by ID
- `PUT /missions/:id` - Update mission
- `DELETE /missions/:id` - Delete mission

### User Missions

- `POST /user-missions` - Start a mission
- `PUT /user-missions/:id` - Update mission progress
- `GET /me/missions` - Get my missions

### Sessions

- `GET /me/sessions` - Get my sessions
- `GET /me/sessions/weekly-points` - Get daily points history

### Articles

- `POST /articles` - Create article with image
- `GET /articles` - Get all articles
- `GET /articles/:id` - Get article by ID
- `PUT /articles/:id` - Update article
- `DELETE /articles/:id` - Delete article

### Files

- `GET /files/:filename` - Get uploaded file (secure access)

## 📦 Response Format

All API responses follow this standardized format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Operation failed",
  "error": "Detailed error message"
}
```

## 🔐 Role-Based Access Control

| Endpoint               | User     | Organization |
| ---------------------- | -------- | ------------ |
| GET /users             | ❌       | ✅           |
| GET /users/leaderboard | ✅       | ✅           |
| PUT /users/:id         | ✅ (own) | ❌           |
| POST /quizzes          | ❌       | ✅           |
| POST /missions         | ❌       | ✅           |
| POST /user-missions    | ✅       | ❌           |
| POST /articles         | ❌       | ✅           |

## 🐳 Docker Deployment

### Start Services

```bash
docker compose up -d
```

### Restart After Code Changes

```bash
git pull origin <branch>
docker compose restart app
```

### View Logs

```bash
docker logs carbonquest-api --tail 50 -f
```

## 📝 NPM Scripts

| Script                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server with hot-reload |
| `npm run build`           | Compile TypeScript to JavaScript         |
| `npm start`               | Start production server                  |
| `npm run prisma:generate` | Generate Prisma Client                   |
| `npm run prisma:migrate`  | Run database migrations                  |

## 🔧 Technology Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript 5.7
- **Framework**: Express.js 5.1
- **ORM**: Prisma 5.18
- **Database**: PostgreSQL 16
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer 2.0
- **Documentation**: Swagger/OpenAPI 3.0
- **Password Hashing**: bcryptjs
- **Container**: Docker & Docker Compose

## 📄 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

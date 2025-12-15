# CarbonQuest Gamification API

A comprehensive gamification API built with **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. This API follows a clean **Model-Service-Repository** architecture pattern with standardized responses, file upload support, and complete Swagger documentation.

## 🚀 Features

- ✅ **TypeScript** - Full type safety across the entire codebase
- ✅ **Model-Service-Repository Architecture** - Clean separation of concerns
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **JWT Authentication** - Secure user and organization authentication
- ✅ **Secure File Upload** - Multer with rate limiting and validation
- ✅ **Rate Limiting** - Upload endpoints (10 req/15min), Auth (5 req/15min), Global (1000 req/min)
- ✅ **Standardized API Responses** - Consistent response format across all endpoints
- ✅ **Swagger Documentation** - Interactive API documentation at `/docs`
- ✅ **Role-Based Access Control** - User and Organization roles with protected endpoints
- ✅ **Docker Support** - Full containerization with Docker Compose
- ✅ **Error Handling** - Centralized error handling middleware

## 📁 Project Structure

```
src/
├── config/
│   └── swagger.ts              # Swagger/OpenAPI configuration
├── middleware/
│   ├── auth.middleware.ts      # JWT authentication middleware
│   ├── error.middleware.ts     # Global error handling
│   ├── rate-limit.middleware.ts # Upload rate limiting
│   └── upload.middleware.ts    # File upload middleware (5MB, images only)
├── modules/
│   ├── auth/
│   │   ├── auth.service.ts     # Authentication business logic
│   │   └── auth.routes.ts      # Auth endpoints (login/register)
│   ├── users/
│   │   ├── user.repository.ts  # User data access layer
│   │   ├── user.service.ts     # User business logic
│   │   └── user.routes.ts      # User endpoints (CRUD + profile image)
│   ├── organizations/
│   │   ├── organization.repository.ts
│   │   ├── organization.service.ts
│   │   └── organization.routes.ts
│   ├── quizzes/
│   │   ├── quiz.repository.ts  # Quiz management
│   │   ├── quiz.service.ts
│   │   └── quiz.routes.ts
│   ├── missions/
│   │   ├── mission.repository.ts
│   │   ├── mission.service.ts
│   │   └── mission.routes.ts   # Supports image upload
│   ├── user-missions/
│   │   ├── user-mission.repository.ts
│   │   ├── user-mission.service.ts
│   │   └── user-mission.routes.ts
│   ├── questions/
│   │   ├── question.repository.ts
│   │   ├── question.service.ts
│   │   └── question.routes.ts  # Belongs to Quizzes
│   ├── answers/
│   │   ├── answer.repository.ts
│   │   ├── answer.service.ts
│   │   └── answer.routes.ts    # Full CRUD with is_correct flag
│   ├── sessions/
│   │   ├── session.repository.ts
│   │   ├── session.service.ts
│   │   └── session.routes.ts
│   └── articles/
│       ├── article.repository.ts
│       ├── article.service.ts
│       └── article.routes.ts   # Supports image upload
├── prisma/
│   └── client.ts               # Prisma client singleton
├── types/
│   └── index.ts                # TypeScript types and interfaces
├── utils/
│   └── response.ts             # Response utility functions
├── app.ts                      # Express app configuration
└── server.ts                   # Server entry point
```

## 🛠️ Installation

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- npm or yarn

### Steps

1. **Clone the repository**

```bash
cd c:\Dev\Backend\carbonquest-test-api
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

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

**http://localhost:4000/docs**

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
  "phone": "081234567890",
  "profile_image": ""
}
```

**Note:** Only `name`, `email`, and `password` are required. `profile_image` defaults to empty string.

#### User Login

```bash
POST /auth/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Organization Registration

```bash
POST /auth/org/register
Content-Type: application/json

{
  "name": "Green Corp",
  "email": "info@greencorp.com",
  "password": "securePassword123",
  "desc": "Environmental sustainability organization"
}
```

### Using JWT Tokens

After successful login, you'll receive a JWT token. Include it in subsequent requests:

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

### Users (Requires Authentication)

- `GET /users` - Get all users (Organization only)
- `GET /users/:id` - Get user by ID
- `GET /users/leaderboard` - Get user leaderboard with points
- `PUT /users/:id` - Update user profile (User can only update own profile)
- `PUT /users/:id/profile-image` - Upload profile image (multipart/form-data, max 5MB)
- `PUT /users/password` - Update password (User only)
- `DELETE /users/:id` - Delete user account (User can delete own, Org can delete any)

### Organizations (Requires Authentication)

- `GET /organizations` - Get all organizations (Organization only)
- `PUT /organizations/password` - Update organization password

### Quizzes (New)

- `POST /quizzes` - Create quiz (Organization only)
- `GET /quizzes` - Get all quizzes with question counts
- `GET /quizzes/:id` - Get quiz by ID
- `PUT /quizzes/:id` - Update quiz (Organization only)
- `DELETE /quizzes/:id` - Delete quiz (Organization only)

### Missions

- `POST /missions` - Create mission with image upload (Organization only)
- `GET /missions` - Get all missions
- `GET /missions/:id` - Get mission by ID
- `PUT /missions/:id` - Update mission (Organization only)
- `DELETE /missions/:id` - Delete mission (Organization only)

### User Missions

- `POST /user-missions` - Start a mission (User only)
- `PUT /user-missions/:id` - Update mission progress (User only)
- `GET /me/missions` - Get my missions (User only)

### Questions & Answers

- `POST /questions` - Create question for a quiz (Organization only)
- `GET /questions` - Get all questions
- `GET /questions/:id` - Get question by ID
- `GET /questions/quiz/:quiz_id` - Get questions by quiz ID
- `PUT /questions/:id` - Update question (Organization only)
- `DELETE /questions/:id` - Delete question (Organization only)
- `POST /questions/:id/answers` - Create answer with is_correct flag (Organization only)
- `GET /questions/:id/answers` - Get answers for question
- `PUT /answers/:id` - Update answer (Organization only)
- `DELETE /answers/:id` - Delete answer (Organization only)

### Sessions

- `POST /sessions` - Create session (User only)
- `PUT /sessions/:id` - Update session (User only)
- `GET /me/sessions` - Get my sessions (User only)

### Articles

- `POST /articles` - Create article with image upload (Organization only)
- `GET /articles` - Get all articles
- `GET /articles/:id` - Get article by ID
- `PUT /articles/:id` - Update article (Organization only)
- `DELETE /articles/:id` - Delete article (Organization only)

### Files (Secure Access)

- `GET /files/:filename` - Get uploaded file (images only, validated)

**Note:** Files are no longer accessible via static `/uploads` folder for security. Use `/files/:filename` endpoint instead.

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

| Endpoint                     | User | Organization |
| ---------------------------- | ---- | ------------ |
| GET /users                   | ❌   | ✅           |
| GET /users/leaderboard       | ✅   | ✅           |
| PUT /users/:id               | ✅   | ❌           |
| PUT /users/:id/profile-image | ✅   | ❌           |
| DELETE /users/:id            | ✅   | ✅           |
| POST /quizzes                | ❌   | ✅           |
| POST /missions               | ❌   | ✅           |
| POST /user-missions          | ✅   | ❌           |
| POST /questions              | ❌   | ✅           |
| POST /articles               | ❌   | ✅           |

**Notes:**

- Users can only update/delete their own profile
- Organizations can delete any user
- **File Upload Security:**
  - Upload rate limit: 10 requests per 15 minutes
  - Files stored in `/uploads`, accessed via `/files/:filename`
  - Path traversal protection and file type validation
  - Max file size: 5MB
  - Allowed formats: jpg, jpeg, png, gif, webp
  - Cached for 1 year (immutable)

## 🧪 Testing with Swagger

1. Start the server
2. Navigate to `http://localhost:4000/docs`
3. Click "Authorize" button
4. Enter your JWT token (with "Bearer " prefix)
5. Test any endpoint directly from the browser

## 🐳 Docker Support

The project includes Docker configuration:

```bash
docker-compose up -d
```

## 📝 Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations

## 🏗️ Architecture Patterns

### Model-Service-Repository Pattern

- **Repository**: Data access layer - handles all Prisma queries
- **Service**: Business logic layer - processes data, enforces rules
- **Controller/Routes**: Presentation layer - handles HTTP requests/responses

### Benefits

- ✅ Separation of concerns
- ✅ Easier testing
- ✅ Better maintainability
- ✅ Reusable business logic
- ✅ Type safety throughout

## 🔧 Technology Stack

- **Runtime**: Node.js v18+
- **Language**: TypeScript 5.7
- **Framework**: Express.js 5.1
- **ORM**: Prisma 5.18
- **Database**: PostgreSQL 16
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer 2.0
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: bcryptjs for password hashing
- **Container**: Docker & Docker Compose

## ✨ Key Features Explained

### Quiz System

- **Hierarchical Structure**: Quizzes → Questions → Answers
- **Categories**: Support for Kuis Harian, Mingguan, Bulanan
- **Auto Counting**: Question counts automatically aggregated
- **Correct Answers**: `is_correct` flag to mark right answers
- **Ordering**: Questions can be ordered within a quiz

### User Profile Management

- **Profile Images**: Upload and manage user profile pictures
- **Full CRUD**: Users can update profile info and delete accounts
- **Default Values**: Profile image defaults to empty string on registration
- **Self-Service**: Users manage their own data

### File Uploads

- **Multiple Contexts**: Missions, Articles, and Profile Images
- **Rate Limited**: 10 uploads per 15 minutes per IP
- **Size Limits**: 5MB maximum per file
- **Type Validation**: Images only (jpg, jpeg, png, gif, webp)
- **Secure Access**: Files accessed via `/files/:filename` with validation
- **Storage**: Local filesystem in `/uploads` directory
- **Security**: Path traversal protection, MIME type validation, filename sanitization

### Leaderboard System

- **Auto Calculation**: Points from quiz sessions + completed missions
- **Profile Integration**: Includes user profile images
- **Sorting**: Ranked by total points descending
- **Transparency**: Shows session and mission points separately

## 📚 Additional Resources

- **Password Hashing**: bcryptjs
- **Documentation**: Swagger/OpenAPI
- **Development**: tsx, nodemon

## 📄 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

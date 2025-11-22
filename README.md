# CarbonQuest Gamification API

A comprehensive gamification API built with **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. This API follows a clean **Model-Service-Repository** architecture pattern with standardized responses and complete Swagger documentation.

## 🚀 Features

- ✅ **TypeScript** - Full type safety across the entire codebase
- ✅ **Model-Service-Repository Architecture** - Clean separation of concerns
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **JWT Authentication** - Secure user and organization authentication
- ✅ **Standardized API Responses** - Consistent response format across all endpoints
- ✅ **Swagger Documentation** - Interactive API documentation at `/docs`
- ✅ **Role-Based Access Control** - User and Organization roles with protected endpoints
- ✅ **Error Handling** - Centralized error handling middleware

## 📁 Project Structure

```
src/
├── config/
│   └── swagger.ts              # Swagger/OpenAPI configuration
├── middleware/
│   ├── auth.middleware.ts      # JWT authentication middleware
│   └── error.middleware.ts     # Global error handling
├── modules/
│   ├── auth/
│   │   ├── auth.service.ts     # Authentication business logic
│   │   └── auth.routes.ts      # Auth endpoints (login/register)
│   ├── users/
│   │   ├── user.repository.ts  # User data access layer
│   │   ├── user.service.ts     # User business logic
│   │   └── user.routes.ts      # User endpoints
│   ├── organizations/
│   │   ├── organization.repository.ts
│   │   ├── organization.service.ts
│   │   └── organization.routes.ts
│   ├── missions/
│   │   ├── mission.repository.ts
│   │   ├── mission.service.ts
│   │   └── mission.routes.ts
│   ├── user-missions/
│   │   ├── user-mission.repository.ts
│   │   ├── user-mission.service.ts
│   │   └── user-mission.routes.ts
│   ├── questions/
│   │   ├── question.repository.ts
│   │   ├── question.service.ts
│   │   └── question.routes.ts
│   ├── answers/
│   │   ├── answer.repository.ts
│   │   ├── answer.service.ts
│   │   └── answer.routes.ts
│   ├── sessions/
│   │   ├── session.repository.ts
│   │   ├── session.service.ts
│   │   └── session.routes.ts
│   └── articles/
│       ├── article.repository.ts
│       ├── article.service.ts
│       └── article.routes.ts
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
  "password": "securePassword123"
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

### Organizations (Requires Authentication)

- `GET /organizations` - Get all organizations (Organization only)

### Missions

- `POST /missions` - Create mission (Organization only)
- `GET /missions` - Get all missions

### User Missions

- `POST /user-missions` - Start a mission (User only)
- `PUT /user-missions/:id` - Update mission progress (User only)
- `GET /me/missions` - Get my missions (User only)

### Questions & Answers

- `POST /questions` - Create question (Organization only)
- `GET /questions` - Get all questions
- `POST /questions/:id/answers` - Create answer (Organization only)
- `GET /questions/:id/answers` - Get answers for question

### Sessions

- `POST /sessions` - Create session (User only)
- `PUT /sessions/:id` - Update session (User only)
- `GET /me/sessions` - Get my sessions (User only)

### Articles

- `POST /articles` - Create article (Organization only)
- `GET /articles` - Get all articles

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

| Endpoint            | User | Organization |
| ------------------- | ---- | ------------ |
| GET /users          | ❌   | ✅           |
| POST /missions      | ❌   | ✅           |
| POST /user-missions | ✅   | ❌           |
| POST /questions     | ❌   | ✅           |
| POST /articles      | ❌   | ✅           |

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

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Documentation**: Swagger/OpenAPI
- **Development**: tsx, nodemon

## 📄 License

ISC

## 👥 Contributing

Feel free to submit issues and enhancement requests!

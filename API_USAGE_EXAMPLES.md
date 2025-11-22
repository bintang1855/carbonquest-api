# API Usage Examples

This document provides practical examples of how to use the CarbonQuest Gamification API.

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [User Journey](#user-journey)
3. [Organization Journey](#organization-journey)
4. [Quiz/Session Flow](#quiz-session-flow)

---

## Authentication Flow

### 1. Register Organization

```http
POST /auth/org/register HTTP/1.1
Content-Type: application/json

{
  "name": "EcoWorld Foundation",
  "email": "admin@ecoworld.org",
  "password": "SecurePass123!",
  "desc": "Making the world greener, one action at a time"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Organization registered successfully",
  "data": {
    "org": {
      "id_organisasi": 1,
      "name": "EcoWorld Foundation",
      "email": "admin@ecoworld.org",
      "desc": "Making the world greener, one action at a time"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJvcmciLCJpYXQiOjE3MDA..."
  }
}
```

### 2. Register User

```http
POST /auth/user/register HTTP/1.1
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "MyPassword456!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id_user": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAw..."
  }
}
```

### 3. Login

```http
POST /auth/user/login HTTP/1.1
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "MyPassword456!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "id_user": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## User Journey

### 1. View Available Missions

```http
GET /missions HTTP/1.1
Authorization: Bearer USER_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Missions retrieved successfully",
  "data": [
    {
      "id_mission": 1,
      "title": "Reduce Plastic Usage",
      "desc": "Complete 10 actions to minimize plastic waste",
      "points": 100,
      "id_creator": 1,
      "creator": {
        "id_organisasi": 1,
        "name": "EcoWorld Foundation",
        "email": "admin@ecoworld.org"
      }
    },
    {
      "id_mission": 2,
      "title": "Energy Conservation Challenge",
      "desc": "Save energy for 7 days straight",
      "points": 150,
      "id_creator": 1,
      "creator": {
        "id_organisasi": 1,
        "name": "EcoWorld Foundation",
        "email": "admin@ecoworld.org"
      }
    }
  ]
}
```

### 2. Start a Mission

```http
POST /user-missions HTTP/1.1
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "id_mission": 1
}
```

**Response:**

```json
{
  "success": true,
  "message": "Mission started successfully",
  "data": {
    "id_working": 1,
    "id_user": 1,
    "id_mission": 1,
    "status": "on_going",
    "points": 0,
    "completed_time": null
  }
}
```

### 3. Complete a Mission

```http
PUT /user-missions/1 HTTP/1.1
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "status": "completed",
  "points": 100,
  "completed_time": "2024-11-22T10:30:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Mission updated successfully",
  "data": {
    "id_working": 1,
    "id_user": 1,
    "id_mission": 1,
    "status": "completed",
    "points": 100,
    "completed_time": "2024-11-22T10:30:00.000Z"
  }
}
```

### 4. View My Missions

```http
GET /me/missions HTTP/1.1
Authorization: Bearer USER_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "User missions retrieved successfully",
  "data": [
    {
      "id_working": 1,
      "id_user": 1,
      "id_mission": 1,
      "status": "completed",
      "points": 100,
      "completed_time": "2024-11-22T10:30:00.000Z",
      "mission": {
        "id_mission": 1,
        "title": "Reduce Plastic Usage",
        "desc": "Complete 10 actions to minimize plastic waste",
        "points": 100,
        "id_creator": 1
      }
    }
  ]
}
```

---

## Organization Journey

### 1. Create a Mission

```http
POST /missions HTTP/1.1
Authorization: Bearer ORG_TOKEN
Content-Type: application/json

{
  "title": "Plant Trees Challenge",
  "desc": "Plant 5 trees in your local community",
  "points": 200
}
```

**Response:**

```json
{
  "success": true,
  "message": "Mission created successfully",
  "data": {
    "id_mission": 3,
    "title": "Plant Trees Challenge",
    "desc": "Plant 5 trees in your local community",
    "points": 200,
    "id_creator": 1
  }
}
```

### 2. Create a Question

```http
POST /questions HTTP/1.1
Authorization: Bearer ORG_TOKEN
Content-Type: application/json

{
  "points": 10,
  "content": "What is the primary greenhouse gas responsible for climate change?",
  "category": "Climate Science"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Question created successfully",
  "data": {
    "id_question": 1,
    "points": 10,
    "content": "What is the primary greenhouse gas responsible for climate change?",
    "category": "Climate Science"
  }
}
```

### 3. Create Answers for Question

```http
POST /questions/1/answers HTTP/1.1
Authorization: Bearer ORG_TOKEN
Content-Type: application/json

{
  "points": 10,
  "desc": "Carbon Dioxide (CO2)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Answer created successfully",
  "data": {
    "id_answer": 1,
    "points": 10,
    "desc": "Carbon Dioxide (CO2)",
    "id_question": 1
  }
}
```

### 4. Create an Article

```http
POST /articles HTTP/1.1
Authorization: Bearer ORG_TOKEN
Content-Type: application/json

{
  "title": "Understanding Carbon Footprint",
  "content": "A carbon footprint is the total amount of greenhouse gases generated by our actions. Learn how to reduce yours..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id_article": 1,
    "title": "Understanding Carbon Footprint",
    "content": "A carbon footprint is the total amount of greenhouse gases...",
    "date_created": "2024-11-22T10:00:00.000Z",
    "id_author": 1
  }
}
```

### 5. View All Users

```http
GET /users HTTP/1.1
Authorization: Bearer ORG_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id_user": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com"
    },
    {
      "id_user": 2,
      "name": "Bob Smith",
      "email": "bob@example.com"
    }
  ]
}
```

---

## Quiz/Session Flow

### 1. Get Questions

```http
GET /questions HTTP/1.1
Authorization: Bearer USER_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Questions retrieved successfully",
  "data": [
    {
      "id_question": 1,
      "points": 10,
      "content": "What is the primary greenhouse gas responsible for climate change?",
      "category": "Climate Science",
      "answers": [
        {
          "id_answer": 1,
          "points": 10,
          "desc": "Carbon Dioxide (CO2)",
          "id_question": 1
        },
        {
          "id_answer": 2,
          "points": 0,
          "desc": "Oxygen",
          "id_question": 1
        }
      ]
    }
  ]
}
```

### 2. Start a Quiz Session

```http
POST /sessions HTTP/1.1
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "id_answer": 1,
  "total_points": 0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "id_session": 1,
    "start_time": "2024-11-22T10:00:00.000Z",
    "end_time": null,
    "total_points": 0,
    "id_user": 1,
    "id_answer": 1
  }
}
```

### 3. Complete Session

```http
PUT /sessions/1 HTTP/1.1
Authorization: Bearer USER_TOKEN
Content-Type: application/json

{
  "total_points": 50,
  "end_time": "2024-11-22T10:15:00Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session updated successfully",
  "data": {
    "id_session": 1,
    "start_time": "2024-11-22T10:00:00.000Z",
    "end_time": "2024-11-22T10:15:00.000Z",
    "total_points": 50,
    "id_user": 1,
    "id_answer": 1
  }
}
```

### 4. View My Sessions

```http
GET /me/sessions HTTP/1.1
Authorization: Bearer USER_TOKEN
```

**Response:**

```json
{
  "success": true,
  "message": "Sessions retrieved successfully",
  "data": [
    {
      "id_session": 1,
      "start_time": "2024-11-22T10:00:00.000Z",
      "end_time": "2024-11-22T10:15:00.000Z",
      "total_points": 50,
      "id_user": 1,
      "id_answer": 1,
      "answer": {
        "id_answer": 1,
        "points": 10,
        "desc": "Carbon Dioxide (CO2)",
        "id_question": 1
      }
    }
  ]
}
```

---

## Error Responses

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Forbidden",
  "error": "Forbidden"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "User not found",
  "error": "User not found"
}
```

### Bad Request (400)

```json
{
  "success": false,
  "message": "Name, email, and password are required",
  "error": "Name, email, and password are required"
}
```

### Invalid Credentials (401)

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "Invalid email or password"
}
```

---

## Tips for Using the API

1. **Always include the Authorization header** for protected routes:

   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

2. **JWT tokens expire after 7 days** - store them securely and refresh when needed

3. **User tokens can only access user endpoints**, org tokens for org endpoints

4. **All timestamps** are in ISO 8601 format

5. **Use Swagger UI** at `/docs` for interactive testing

6. **Check the `success` field** in responses to determine if the request succeeded

7. **Points are accumulated** from missions and quiz sessions

---

## Complete Flow Example

Here's a complete workflow from organization creating content to user participating:

### Step 1: Organization creates a mission

```bash
POST /missions (ORG_TOKEN)
```

### Step 2: Organization creates questions

```bash
POST /questions (ORG_TOKEN)
POST /questions/:id/answers (ORG_TOKEN)
```

### Step 3: Organization publishes article

```bash
POST /articles (ORG_TOKEN)
```

### Step 4: User views content

```bash
GET /missions (USER_TOKEN)
GET /questions (USER_TOKEN)
GET /articles (USER_TOKEN)
```

### Step 5: User participates

```bash
POST /user-missions (USER_TOKEN)       # Start mission
POST /sessions (USER_TOKEN)            # Start quiz
PUT /sessions/:id (USER_TOKEN)         # Complete quiz
PUT /user-missions/:id (USER_TOKEN)    # Complete mission
```

### Step 6: User views progress

```bash
GET /me/missions (USER_TOKEN)
GET /me/sessions (USER_TOKEN)
```

---

That's it! You now have a complete understanding of how to use the CarbonQuest Gamification API. Happy coding! 🚀

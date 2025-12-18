# 🎯 Complete Flow: Quiz → Session

Dokumentasi lengkap tentang alur dari pembuatan quiz hingga session tracking dalam CarbonQuest API.

---

## Phase 1: Organization Creates Quiz

### Endpoint: `POST /quizzes`

Organization membuat quiz dengan questions & answers dalam satu request.

**Request Body:**

```json
{
  "title": "Kuis Perubahan Iklim",
  "category": "Mingguan",
  "total_points": 100,
  "questions": [
    {
      "content": "Apa penyebab utama perubahan iklim?",
      "points": 10,
      "order": 1,
      "answers": [
        { "content": "Emisi gas rumah kaca", "is_correct": true },
        { "content": "Hujan", "is_correct": false },
        { "content": "Angin", "is_correct": false },
        { "content": "Salju", "is_correct": false }
      ]
    },
    {
      "content": "Apa itu energi terbarukan?",
      "points": 10,
      "order": 2,
      "answers": [
        { "content": "Tenaga surya dan angin", "is_correct": true },
        { "content": "Batu bara", "is_correct": false }
      ]
    }
  ]
}
```

**Database After Creation:**

**QUIZZES Table:**
| id_quiz | title | category | total_points |
|---------|------------------------|----------|--------------|
| 1 | Kuis Perubahan Iklim | Mingguan | 100 |

**QUESTIONS Table:**
| id_question | id_quiz | content | points | order |
|-------------|---------|--------------------------------------|--------|-------|
| 1 | 1 | Apa penyebab utama perubahan iklim? | 10 | 1 |
| 2 | 1 | Apa itu energi terbarukan? | 10 | 2 |

**ANSWERS Table:**
| id_answer | id_question | content | is_correct |
|-----------|-------------|-----------------------|------------|
| 1 | 1 | Emisi gas rumah kaca | true |
| 2 | 1 | Hujan | false |
| 3 | 1 | Angin | false |
| 4 | 1 | Salju | false |
| 5 | 2 | Tenaga surya dan angin| true |
| 6 | 2 | Batu bara | false |

---

## Phase 2: User Views Available Quizzes

### Endpoint: `GET /quizzes`

User fetch semua quiz yang tersedia dengan questions dan answers.

**Response:**

```json
[
  {
    "id_quiz": 1,
    "title": "Kuis Perubahan Iklim",
    "category": "Mingguan",
    "total_points": 100,
    "question_count": 2,
    "questions": [
      {
        "id_question": 1,
        "content": "Apa penyebab utama perubahan iklim?",
        "points": 10,
        "order": 1,
        "answers": [
          {
            "id_answer": 1,
            "content": "Emisi gas rumah kaca",
            "is_correct": true
          },
          { "id_answer": 2, "content": "Hujan", "is_correct": false },
          { "id_answer": 3, "content": "Angin", "is_correct": false },
          { "id_answer": 4, "content": "Salju", "is_correct": false }
        ]
      },
      {
        "id_question": 2,
        "content": "Apa itu energi terbarukan?",
        "points": 10,
        "order": 2,
        "answers": [
          {
            "id_answer": 5,
            "content": "Tenaga surya dan angin",
            "is_correct": true
          },
          { "id_answer": 6, "content": "Batu bara", "is_correct": false }
        ]
      }
    ]
  }
]
```

---

## Phase 3: User Starts Quiz

**⚠️ TIDAK ada endpoint "Start Quiz"!**

User langsung submit answers per question. Session akan dibuat otomatis setiap kali user submit answer.

---

## Phase 4: User Submits Answer (Question 1) - CORRECT ✅

### Endpoint: `POST /quizzes/submit-answer`

**Request:**

```json
{
  "id_question": 1,
  "id_answer": 1
}
```

**Backend Logic Flow:**

```typescript
// 1. Find answer dengan question details
const answer = await findAnswerById(1);
// Result:
// {
//   id_answer: 1,
//   content: "Emisi gas rumah kaca",
//   is_correct: true,
//   id_question: 1,
//   question: {
//     id_question: 1,
//     id_quiz: 1,
//     points: 10
//   }
// }

// 2. Validate answer belongs to question
if (answer.id_question !== 1) throw Error("Answer does not belong to question");
// ✅ PASS

// 3. Calculate points
const pointsEarned = answer.is_correct ? 10 : 0;
// = 10 points

// 4. Get quiz ID
const quizId = answer.question.id_quiz; // = 1

// 5. ✨ AUTO CREATE SESSION ✨
const session = await createSession({
  id_user: 5, // Current user ID
  id_answer: 1, // Answer yang dipilih
  id_quiz: 1, // From question
  session_type: "quiz",
  total_points: 10, // Points earned
  start_time: "2025-12-18T11:00:00Z",
  end_time: "2025-12-18T11:00:00Z", // Instant complete
});

// 6. Check if wrong answer (untuk showing correct answer)
let correctAnswer = undefined;
if (!answer.is_correct) {
  const correct = answer.question.answers.find((a) => a.is_correct);
  correctAnswer = correct?.content;
}

// 7. Return result
return {
  is_correct: true,
  points_earned: 10,
  correct_answer: undefined, // Tidak ditampilkan karena benar
  session_id: 100,
};
```

**Database After Submit:**

**SESSIONS Table (NEW ENTRY):**
| id_session | id_user | id_quiz | id_answer | session_type | total_points | start_time | end_time |
|------------|---------|---------|-----------|--------------|--------------|---------------------|---------------------|
| 100 | 5 | 1 | 1 | quiz | 10 | 2025-12-18 11:00:00 | 2025-12-18 11:00:00 |

**Response:**

```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "data": {
    "is_correct": true,
    "points_earned": 10,
    "session_id": 100
  }
}
```

---

## Phase 5: User Submits Answer (Question 2) - WRONG ❌

### Endpoint: `POST /quizzes/submit-answer`

**Request:**

```json
{
  "id_question": 2,
  "id_answer": 6
}
```

**Backend Logic Flow:**

```typescript
// 1. Find answer
const answer = await findAnswerById(6);
// {
//   id_answer: 6,
//   content: "Batu bara",
//   is_correct: false,  // ❌ SALAH
//   id_question: 2,
//   question: {
//     id_question: 2,
//     id_quiz: 1,
//     points: 10,
//     answers: [
//       { id_answer: 5, content: "Tenaga surya dan angin", is_correct: true },
//       { id_answer: 6, content: "Batu bara", is_correct: false }
//     ]
//   }
// }

// 2. Calculate points
const pointsEarned = false ? 10 : 0; // = 0 points

// 3. ✨ AUTO CREATE SESSION (tetap dibuat meskipun salah!)
const session = await createSession({
  id_user: 5,
  id_answer: 6,
  id_quiz: 1,
  session_type: "quiz",
  total_points: 0, // ❌ 0 points karena salah
  start_time: "2025-12-18T11:01:00Z",
  end_time: "2025-12-18T11:01:00Z",
});

// 4. Find correct answer untuk feedback
const correctAnswer = answer.question.answers.find((a) => a.is_correct);
// = { content: "Tenaga surya dan angin" }

// 5. Return result with correct answer
return {
  is_correct: false,
  points_earned: 0,
  correct_answer: "Tenaga surya dan angin", // ✅ Ditampilkan untuk edukasi
  session_id: 101,
};
```

**Database After Submit:**

**SESSIONS Table (ENTRY KEDUA):**
| id_session | id_user | id_quiz | id_answer | session_type | total_points | start_time | end_time |
|------------|---------|---------|-----------|--------------|--------------|---------------------|---------------------|
| 100 | 5 | 1 | 1 | quiz | 10 | 2025-12-18 11:00:00 | 2025-12-18 11:00:00 |
| 101 | 5 | 1 | 6 | quiz | 0 | 2025-12-18 11:01:00 | 2025-12-18 11:01:00 |

**Response:**

```json
{
  "success": true,
  "message": "Answer submitted successfully",
  "data": {
    "is_correct": false,
    "points_earned": 0,
    "correct_answer": "Tenaga surya dan angin",
    "session_id": 101
  }
}
```

---

## Phase 6: User Views Session History

### Endpoint: `GET /me/sessions`

User dapat melihat semua quiz sessions yang telah dikerjakan.

**Response:**

```json
[
  {
    "id_session": 100,
    "id_user": 5,
    "session_type": "quiz",
    "total_points": 10,
    "start_time": "2025-12-18T11:00:00Z",
    "end_time": "2025-12-18T11:00:00Z",
    "quiz": {
      "id_quiz": 1,
      "title": "Kuis Perubahan Iklim"
    },
    "answer": {
      "id_answer": 1,
      "content": "Emisi gas rumah kaca",
      "is_correct": true,
      "question": {
        "id_question": 1,
        "content": "Apa penyebab utama perubahan iklim?"
      }
    }
  },
  {
    "id_session": 101,
    "id_user": 5,
    "session_type": "quiz",
    "total_points": 0,
    "start_time": "2025-12-18T11:01:00Z",
    "end_time": "2025-12-18T11:01:00Z",
    "quiz": {
      "id_quiz": 1,
      "title": "Kuis Perubahan Iklim"
    },
    "answer": {
      "id_answer": 6,
      "content": "Batu bara",
      "is_correct": false,
      "question": {
        "id_question": 2,
        "content": "Apa itu energi terbarukan?"
      }
    }
  }
]
```

---

## Phase 7: User Views Daily Points

### Endpoint: `GET /me/sessions/daily-points?days=7`

Menampilkan aggregated points per hari untuk chart/statistics.

**Backend Logic:**

```typescript
async getWeeklyPointsHistory(userId: number, days: number = 7) {
  // 1. Setup date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));

  // 2. Fetch quiz sessions & mission completions
  const { quizSessions, missionCompletions } =
    await getWeeklyPoints(userId, Math.ceil(days / 7));

  // 3. Initialize all days with 0
  const dailyData = new Map();
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    dailyData.set(dayKey, {
      week: dayKey,
      mission_points: 0,
      quiz_points: 0,
      total_points: 0,
      missions_completed: 0,
      quizzes_completed: 0
    });
  }

  // 4. Process quiz sessions - group by day
  quizSessions.forEach(session => {
    const dayKey = getDayKey(session.end_time);
    if (dailyData.has(dayKey)) {
      const dayData = dailyData.get(dayKey);
      dayData.quiz_points += session.total_points || 0;
      dayData.quizzes_completed += 1;
      dayData.total_points = dayData.mission_points + dayData.quiz_points;
    }
  });

  // 5. Process mission completions - group by day
  missionCompletions.forEach(mission => {
    const dayKey = getDayKey(mission.completed_time);
    if (dailyData.has(dayKey)) {
      const dayData = dailyData.get(dayKey);
      dayData.mission_points += mission.points || 0;
      dayData.missions_completed += 1;
      dayData.total_points = dayData.mission_points + dayData.quiz_points;
    }
  });

  // 6. Convert to array and sort
  return Array.from(dailyData.values()).sort((a, b) =>
    a.week.localeCompare(b.week)
  );
}
```

**Response:**

```json
[
  {
    "week": "2025-12-18",
    "mission_points": 0,
    "quiz_points": 10,
    "total_points": 10,
    "missions_completed": 0,
    "quizzes_completed": 2
  },
  {
    "week": "2025-12-19",
    "mission_points": 0,
    "quiz_points": 0,
    "total_points": 0,
    "missions_completed": 0,
    "quizzes_completed": 0
  }
  // ... 5 hari lainnya
]
```

---

## 📊 Visual Flow Diagram

```
┌────────────────────────────────────────────┐
│          ORGANIZATION                       │
│  POST /quizzes                             │
│  └─> Create Quiz + Questions + Answers    │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│          USER                              │
│  GET /quizzes                              │
│  └─> View available quizzes               │
└────────────────────────────────────────────┘
                    │
                    ▼
          [Answer Question 1]
                    │
                    ▼
┌────────────────────────────────────────────┐
│  POST /quizzes/submit-answer               │
│  { id_question: 1, id_answer: 1 }          │
└────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────┐
│          BACKEND LOGIC                     │
│                                            │
│  1. Find answer with question details     │
│  2. Validate answer belongs to question   │
│  3. Calculate points                       │
│  4. ✨ AUTO CREATE SESSION                │
│     - id_user: current user               │
│     - id_quiz: from question              │
│     - id_answer: submitted answer         │
│     - total_points: calculated            │
│  5. If wrong, find correct answer         │
│  6. Return feedback                        │
└────────────────────────────────────────────┘
                    │
                    ▼
      [Show Feedback to User]
      is_correct: true
      points_earned: 10
                    │
                    ▼
          [Answer Question 2]
                    │
                    ▼
      POST /quizzes/submit-answer
      { id_question: 2, id_answer: 6 }
                    │
                    ▼
      [AUTO CREATE SESSION #2]
      total_points: 0 (wrong answer)
                    │
                    ▼
┌────────────────────────────────────────────┐
│  GET /me/sessions                          │
│  └─> View all quiz sessions               │
│                                            │
│  GET /me/sessions/daily-points             │
│  └─> View aggregated points per day       │
└────────────────────────────────────────────┘
```

---

## 🔑 Key Points

### Session Auto-Creation

- ✅ **Setiap submit answer = 1 session dibuat otomatis**
- ✅ **Session dibuat bahkan jika jawaban salah** (dengan 0 points)
- ✅ **Tidak perlu manual create/start session**
- ✅ **Session langsung complete** (start_time = end_time)

### Quiz Structure

- 📝 **1 Quiz** dapat memiliki banyak Questions
- 📝 **1 Question** dapat memiliki banyak Answers
- 📝 **1 Answer** harus ditandai sebagai correct (`is_correct: true`)

### Points Calculation

- ✅ **Correct answer**: points = question.points
- ❌ **Wrong answer**: points = 0
- 📊 **Daily points**: aggregasi dari semua sessions + missions per hari

### Important Notes

- ⚠️ **Quiz dengan 10 pertanyaan = 10 sessions terpisah!**
- ⚠️ **Correct answer hanya ditampilkan jika user salah** (untuk edukasi)
- ⚠️ **Session type selalu "quiz"** untuk quiz submissions
- ⚠️ **end_time = start_time** karena submission instant

---

## 🎯 Summary

```
1 Quiz Attempt dengan 5 Questions = 5 Separate Sessions Created

Example:
Quiz: "Kuis Perubahan Iklim" (5 questions)
User answers:
  Q1: Correct  → Session 1 created (10 points)
  Q2: Wrong    → Session 2 created (0 points)
  Q3: Correct  → Session 3 created (10 points)
  Q4: Correct  → Session 4 created (10 points)
  Q5: Wrong    → Session 5 created (0 points)

Total: 5 sessions, 30 points earned
Daily Points: quiz_points = 30, quizzes_completed = 5
```

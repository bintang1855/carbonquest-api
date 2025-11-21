import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-ganti-di-prod";

// middleware global
app.use(cors());
app.use(express.json());

// ========= helper auth ==========

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // { sub, role, ... }

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

// ========= health check ==========

app.get("/", (req, res) => {
  res.json({ message: "Gamification API OK" });
});

// ========= AUTH: USERS =========

// register user biasa
app.post("/auth/user/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "name, email, password wajib diisi" });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { name, email, password: hashed },
    });
    const token = generateToken({ sub: user.id_user, role: "user" });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal register user" });
  }
});

// login user
app.post("/auth/user/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email & password wajib diisi" });

  try {
    const user = await prisma.users.findFirst({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Email atau password salah" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Email atau password salah" });

    const token = generateToken({ sub: user.id_user, role: "user" });
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal login" });
  }
});

// ========= AUTH: ORGANIZATION =========

app.post("/auth/org/register", async (req, res) => {
  const { name, email, password, desc } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "name, email, password wajib diisi" });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const org = await prisma.organization.create({
      data: { name, email, password: hashed, desc },
    });
    const token = generateToken({ sub: org.id_organisasi, role: "org" });
    res.status(201).json({ org, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal register org" });
  }
});

app.post("/auth/org/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email & password wajib diisi" });

  try {
    const org = await prisma.organization.findFirst({ where: { email } });
    if (!org)
      return res.status(401).json({ error: "Email atau password salah" });

    const match = await bcrypt.compare(password, org.password);
    if (!match)
      return res.status(401).json({ error: "Email atau password salah" });

    const token = generateToken({ sub: org.id_organisasi, role: "org" });
    res.json({ org, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal login org" });
  }
});

// ========= USERS CRUD (protected contoh: hanya org boleh lihat semua user) =========

app.get("/users", authMiddleware("org"), async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get users" });
  }
});

app.get("/users/:id", authMiddleware(), async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.users.findUnique({
      where: { id_user: id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// ========= ORGANIZATION CRUD (basic) =========

app.get("/organizations", authMiddleware("org"), async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany();
    res.json(orgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get organizations" });
  }
});

// ========= MISSIONS & USER_MISSIONS =========

// org membuat mission
app.post("/missions", authMiddleware("org"), async (req, res) => {
  const { title, desc, points } = req.body;

  try {
    const mission = await prisma.missions.create({
      data: {
        title,
        desc,
        points,
        id_creator: req.user.sub, // org id
      },
    });
    res.status(201).json(mission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create mission" });
  }
});

app.get("/missions", authMiddleware(), async (req, res) => {
  try {
    const missions = await prisma.missions.findMany({
      include: { creator: true },
    });
    res.json(missions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get missions" });
  }
});

// user mulai/ambil mission
app.post("/user-missions", authMiddleware("user"), async (req, res) => {
  const { id_mission } = req.body;
  try {
    const working = await prisma.user_Missions.create({
      data: {
        id_user: req.user.sub,
        id_mission,
        status: "on_going",
        points: 0,
        completed_time: null,
      },
    });
    res.status(201).json(working);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user_mission" });
  }
});

// update status mission user (selesai, points, dll)
app.put("/user-missions/:id", authMiddleware("user"), async (req, res) => {
  const id = Number(req.params.id);
  const { status, points, completed_time } = req.body;
  try {
    const updated = await prisma.user_Missions.update({
      where: { id_working: id },
      data: {
        status,
        points,
        completed_time: completed_time ? new Date(completed_time) : null,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user_mission" });
  }
});

// list mission milik user login
app.get("/me/missions", authMiddleware("user"), async (req, res) => {
  try {
    const data = await prisma.user_Missions.findMany({
      where: { id_user: req.user.sub },
      include: { mission: true },
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get my missions" });
  }
});

// ========= QUESTIONS & ANSWERS =========

// CRUD questions (org sebagai pembuat soal, misal)
app.post("/questions", authMiddleware("org"), async (req, res) => {
  const { points, content, category } = req.body;
  try {
    const q = await prisma.questions.create({
      data: { points, content, category },
    });
    res.status(201).json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create question" });
  }
});

app.get("/questions", authMiddleware(), async (req, res) => {
  try {
    const list = await prisma.questions.findMany({
      include: { answers: true },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get questions" });
  }
});

// answers untuk suatu question
app.post("/questions/:id/answers", authMiddleware("org"), async (req, res) => {
  const id_question = Number(req.params.id);
  const { points, desc } = req.body;

  try {
    const ans = await prisma.answers.create({
      data: { id_question, points, desc },
    });
    res.status(201).json(ans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create answer" });
  }
});

app.get("/questions/:id/answers", authMiddleware(), async (req, res) => {
  const id_question = Number(req.params.id);
  try {
    const list = await prisma.answers.findMany({
      where: { id_question },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get answers" });
  }
});

// ========= SESSIONS (start/end quiz + total_points) =========

// create session (misal user mulai sesi quiz)
app.post("/sessions", authMiddleware("user"), async (req, res) => {
  const { id_answer, total_points, start_time, end_time } = req.body;
  try {
    const session = await prisma.sessions.create({
      data: {
        id_user: req.user.sub,
        id_answer,
        total_points: total_points ?? 0,
        start_time: start_time ? new Date(start_time) : new Date(),
        end_time: end_time ? new Date(end_time) : null,
      },
    });
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

// update session (misal isi end_time & total_points ketika selesai)
app.put("/sessions/:id", authMiddleware("user"), async (req, res) => {
  const id = Number(req.params.id);
  const { total_points, end_time } = req.body;
  try {
    const updated = await prisma.sessions.update({
      where: { id_session: id },
      data: {
        total_points,
        end_time: end_time ? new Date(end_time) : new Date(),
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update session" });
  }
});

// list session user login
app.get("/me/sessions", authMiddleware("user"), async (req, res) => {
  try {
    const list = await prisma.sessions.findMany({
      where: { id_user: req.user.sub },
      include: { answer: true },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get sessions" });
  }
});

// ========= ARTICLES =========

// org membuat artikel
app.post("/articles", authMiddleware("org"), async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = await prisma.articles.create({
      data: {
        title,
        content,
        date_created: new Date(),
        id_author: req.user.sub,
      },
    });
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create article" });
  }
});

app.get("/articles", authMiddleware(), async (req, res) => {
  try {
    const list = await prisma.articles.findMany({
      include: { author: true },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get articles" });
  }
});

// ========= start server =========

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

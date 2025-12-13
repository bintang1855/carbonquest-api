import { Request } from "express";

// Standardized API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// JWT payload types
export interface JwtPayload {
  sub: number; // user id or org id
  role: "user" | "org";
  iat?: number;
  exp?: number;
}

// Extended Express Request with user
export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: JwtPayload;
}

// DTOs and domain types
export interface UserDTO {
  id_user: number;
  name: string;
  last_name?: string | null;
  birth_date?: Date | null;
  email: string;
  phone?: string | null;
  password?: string; // Optional in responses
}

export interface CreateUserDTO {
  name: string;
  last_name?: string;
  birth_date?: string | Date;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface OrganizationDTO {
  id_organisasi: number;
  name: string;
  email: string;
  desc?: string | null;
  password?: string;
}

export interface CreateOrganizationDTO {
  name: string;
  email: string;
  password: string;
  desc?: string;
}

export interface MissionDTO {
  id_mission: number;
  title: string;
  tags?: string | null;
  desc?: string | null;
  cover_image?: string | null;
  photo_caption?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  points?: number | null;
  highlights?: string | null;
  date_created?: Date | null;
  id_creator: number;
}

export interface CreateMissionDTO {
  title: string;
  tags?: string;
  desc?: string;
  cover_image?: string;
  photo_caption?: string;
  author_name?: string;
  author_role?: string;
  points?: number;
  highlights?: string;
}

export interface UserMissionDTO {
  id_working: number;
  id_user: number;
  id_mission: number;
  status?: string | null;
  points?: number | null;
  completed_time?: Date | null;
}

export interface CreateUserMissionDTO {
  id_mission: number;
}

export interface UpdateUserMissionDTO {
  status?: string;
  points?: number;
  completed_time?: string;
}

export interface QuizDTO {
  id_quiz: number;
  title: string;
  category?: string | null;
  total_points?: number | null;
  id_creator: number;
  created_at?: Date | null;
}

export interface CreateQuizDTO {
  title: string;
  category?: string;
  total_points?: number;
}

export interface QuestionDTO {
  id_question: number;
  id_quiz: number;
  content: string;
  points?: number | null;
  order?: number | null;
}

export interface CreateQuestionDTO {
  id_quiz: number;
  content: string;
  points?: number;
  order?: number;
}

export interface AnswerDTO {
  id_answer: number;
  id_question: number;
  content: string;
  is_correct: boolean;
}

export interface CreateAnswerDTO {
  id_question: number;
  content: string;
  is_correct: boolean;
}

export interface SessionDTO {
  id_session: number;
  start_time?: Date | null;
  end_time?: Date | null;
  total_points?: number | null;
  id_user: number;
  id_answer: number;
}

export interface CreateSessionDTO {
  id_answer: number;
  total_points?: number;
  start_time?: string;
  end_time?: string;
}

export interface UpdateSessionDTO {
  total_points?: number;
  end_time?: string;
}

export interface ArticleDTO {
  id_article: number;
  title: string;
  topic?: string | null;
  description?: string | null;
  content?: string | null;
  cover_image?: string | null;
  photo_caption?: string | null;
  photo_credit?: string | null;
  author_name?: string | null;
  author_role?: string | null;
  place?: string | null;
  highlights?: string | null;
  date_created?: Date | null;
  id_author: number;
}

export interface CreateArticleDTO {
  title: string;
  topic?: string;
  description?: string;
  content?: string;
  cover_image?: string;
  photo_caption?: string;
  photo_credit?: string;
  author_name?: string;
  author_role?: string;
  place?: string;
  highlights?: string;
}

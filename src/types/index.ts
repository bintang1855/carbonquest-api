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
  email: string;
  password?: string; // Optional in responses
}

export interface CreateUserDTO {
  name: string;
  email: string;
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

export interface QuestionDTO {
  id_question: number;
  points?: number | null;
  content?: string | null;
  category?: string | null;
}

export interface CreateQuestionDTO {
  points?: number;
  content?: string;
  category?: string;
}

export interface AnswerDTO {
  id_answer: number;
  points?: number | null;
  desc?: string | null;
  id_question: number;
}

export interface CreateAnswerDTO {
  points?: number;
  desc?: string;
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

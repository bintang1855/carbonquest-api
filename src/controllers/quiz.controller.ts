import { NextFunction, Response } from "express";
import {
  AuthenticatedRequest,
  CreateQuizDTO,
  SubmitQuizAnswerDTO,
} from "../types/index.js";
import { ResponseUtil } from "../utils/response.js";
import { QuizService } from "../services/quiz.service.js";

export class QuizController {
  private service: QuizService;

  constructor() {
    this.service = new QuizService();
  }

  /**
   * Create a new quiz
   */
  public createQuiz = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: CreateQuizDTO = req.body;
      const quiz = await this.service.createQuiz(data, req.user.sub);
      ResponseUtil.created(res, "Quiz created successfully", quiz);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get all quizzes
   */
  public getAllQuizzes = async (
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const quizzes = await this.service.getAllQuizzes();
      ResponseUtil.success(res, "Quizzes retrieved successfully", quizzes);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get quiz by ID
   */
  public getQuizById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const quiz = await this.service.getQuizById(id);
      ResponseUtil.success(res, "Quiz retrieved successfully", quiz);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update a quiz
   */
  public updateQuiz = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const quiz = await this.service.updateQuiz(id, data);
      ResponseUtil.success(res, "Quiz updated successfully", quiz);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete a quiz
   */
  public deleteQuiz = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteQuiz(id);
      ResponseUtil.success(res, "Quiz deleted successfully", null);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Submit quiz answer
   */
  public submitAnswer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data: SubmitQuizAnswerDTO = req.body;
      const result = await this.service.submitAnswer(data, req.user.sub);
      ResponseUtil.success(res, "Answer submitted successfully", result);
    } catch (err) {
      next(err);
    }
  };
}

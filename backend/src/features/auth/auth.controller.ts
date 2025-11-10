import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../common/utils/response';
import { asyncHandler } from '../../common/utils/async-handler';
import {
  ChangePasswordDto,
  RequestWithUser,
  UpdateProfileDto,
} from './auth.types';

export class AuthController {
  /**
   * Register a new user
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, 'User registered successfully');
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    return ApiResponse.success(res, result, 'Login successful');
  });

  /**
   * Get current user profile
   * GET /api/v1/auth/profile
   */
  getProfile = asyncHandler(async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return ApiResponse.error(res, 'User not authenticated', 401);
    }

    const user = await authService.getProfile(req.user.userId);
    return ApiResponse.success(res, user);
  });

  /**
   * Update user profile
   * PATCH /api/v1/auth/profile
   */
  updateProfile = asyncHandler(async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return ApiResponse.error(res, 'User not authenticated', 401);
    }

    const user = await authService.updateProfile(
      req.user.userId,
      req.body as UpdateProfileDto
    );
    return ApiResponse.success(res, user, 'Profile updated successfully');
  });

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword = asyncHandler(async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return ApiResponse.error(res, 'User not authenticated', 401);
    }

    const result = await authService.changePassword(
      req.user.userId,
      req.body as unknown as ChangePasswordDto
    );
    return ApiResponse.success(res, result);
  });
}

export const authController = new AuthController();

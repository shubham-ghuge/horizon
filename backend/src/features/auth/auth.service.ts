import { AppError } from '../../common/middlewares/error-handler';
import { authRepository } from './auth.repository';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  UpdateProfileDto,
  AuthResponse,
  Role,
} from './auth.types';
import { AuthUtils } from './auth.utils';

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await AuthUtils.hashPassword(data.password);

    // Create user with default role VIEWER if not specified
    const user = await authRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      role: data.role || Role.VIEWER,
    });

    // Generate token
    const token = AuthUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
      },
      token,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(
      data.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = AuthUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as Role,
      },
      token,
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return authRepository.update(userId, data);
  }

  /**
   * Change user password
   */
  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await authRepository.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await AuthUtils.comparePassword(
      data.currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const passwordHash = await AuthUtils.hashPassword(data.newPassword);

    // Update password
    await authRepository.update(userId, { passwordHash });

    return { message: 'Password changed successfully' };
  }
}

export const authService = new AuthService();

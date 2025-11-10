import { Router } from 'express';
import { validateDto } from '../../common/middlewares/validate';
import { authController } from './auth.controller';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from './auth.types';
import { authenticate } from './auth.middleware';

const router = Router();

// Public routes
router.post(
  '/auth/register',
  validateDto(RegisterDto),
  authController.register
);

router.post('/auth/login', validateDto(LoginDto), authController.login);

// Protected routes (require authentication)
router.get('/auth/profile', authenticate, authController.getProfile);

router.patch(
  '/auth/profile',
  authenticate,
  validateDto(UpdateProfileDto),
  authController.updateProfile
);

router.post(
  '/auth/change-password',
  authenticate,
  validateDto(ChangePasswordDto),
  authController.changePassword
);

export default router;

import { Response, NextFunction } from 'express';
import { AppError } from '../../common/middlewares/error-handler';
import { AuthUtils } from './auth.utils';
import { RequestWithUser, Role } from './auth.types';

/**
 * Middleware to authenticate user using JWT
 */
export const authenticate = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from header
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token
    const payload = AuthUtils.verifyToken(token);

    // Attach user to request
    req.user = payload;

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(error);
  }
};

/**
 * Middleware to authorize user based on roles
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

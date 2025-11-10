import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ApiResponse } from '../utils/response';

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    if (errors.length > 0) {
      const formattedErrors = formatValidationErrors(errors);
      return ApiResponse.badRequest(res, 'Validation failed', formattedErrors);
    }

    // Replace req.body with the transformed instance
    req.body = dtoInstance;
    next();
  };
};

function formatValidationErrors(errors: ValidationError[]): any {
  return errors.reduce((acc: any, error: ValidationError) => {
    const property = error.property;
    const constraints = error.constraints;

    if (constraints) {
      acc[property] = Object.values(constraints);
    }

    if (error.children && error.children.length > 0) {
      acc[property] = formatValidationErrors(error.children);
    }

    return acc;
  }, {});
}

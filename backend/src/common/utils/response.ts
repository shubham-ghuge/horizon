import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res: Response, data: any, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static notFound(res: Response, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static error(res: Response, message: string, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

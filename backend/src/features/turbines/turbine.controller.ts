import { Request, Response } from 'express';
import { turbineService } from './turbine.service';
import { ApiResponse } from '../../common/utils/response';
import { asyncHandler } from '../../common/utils/async-handler';

export class TurbineController {
  getTurbines = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 50 } = req.query;

    const turbines = await turbineService.findAll({
      page: Number(page),
      limit: Number(limit),
    });

    return ApiResponse.success(res, turbines);
  });

  createTurbine = asyncHandler(async (req: Request, res: Response) => {
    const turbine = await turbineService.create(req.body);
    return ApiResponse.created(res, turbine);
  });

  getTurbineById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const turbine = await turbineService.findById(id);

    if (!turbine) {
      return ApiResponse.notFound(res, 'Turbine not found');
    }

    return ApiResponse.success(res, turbine);
  });

  updateTurbine = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const turbine = await turbineService.update(id, req.body);
    return ApiResponse.success(res, turbine);
  });

  deleteTurbine = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await turbineService.delete(id);
    return ApiResponse.success(res, {
      message: 'Turbine deleted successfully',
    });
  });
}

export const turbineController = new TurbineController();

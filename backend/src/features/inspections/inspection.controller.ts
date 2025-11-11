import { Request, Response } from 'express';
import { inspectionService } from './inspection.service';
import { ApiResponse } from '../../common/utils/response';
import { asyncHandler } from '../../common/utils/async-handler';
import { InspectionFilterDto } from './inspection.types';

export class InspectionController {
  getInspections = asyncHandler(async (req: Request, res: Response) => {
    const filterDto = req.body as InspectionFilterDto;

    const { page = 1, limit = 10, ...filters } = filterDto;

    const inspections = await inspectionService.findAll({
      page: Number(page),
      limit: Number(limit),
      filters,
    });

    return ApiResponse.success(res, inspections);
  });

  createInspection = asyncHandler(async (req: Request, res: Response) => {
    const inspection = await inspectionService.create(req.body);
    return ApiResponse.created(res, inspection);
  });

  getInspectionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const inspection = await inspectionService.findById(id);
    return ApiResponse.success(res, inspection);
  });

  updateInspection = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const inspection = await inspectionService.update(id, req.body);
    return ApiResponse.success(res, inspection);
  });

  deleteInspection = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await inspectionService.delete(id);
    return ApiResponse.success(res, {
      message: 'Inspection deleted successfully',
    });
  });
}

export const inspectionController = new InspectionController();

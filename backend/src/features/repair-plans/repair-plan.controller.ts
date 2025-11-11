import { Request, Response } from 'express';
import { ApiResponse } from '../../common/utils/response';
import { asyncHandler } from '../../common/utils/async-handler';
import { RepairPlanFilterDto } from './repair-plan.types';
import { repairPlanService } from './repair-plan.service';
 
export class RepairPlanController {
  getRepairPlans = asyncHandler(async (req: Request, res: Response) => {
    const filterDto = req.body as RepairPlanFilterDto;
    const { page = 1, limit = 10, ...filters } = filterDto;
 
    const plans = await repairPlanService.findAll({
      page: Number(page),
      limit: Number(limit),
      filters,
    });
 
    return ApiResponse.success(res, plans);
  });
}
 
export const repairPlanController = new RepairPlanController();


import { Router } from 'express';
import { repairPlanController } from './repair-plan.controller';
import { validateDto } from '../../common/middlewares/validate';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '../auth/auth.types';
import { RepairPlanFilterDto } from './repair-plan.types';

const router = Router();

router.post(
  '/repair-plans/search',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  validateDto(RepairPlanFilterDto),
  repairPlanController.getRepairPlans
);

export default router;

import { Router } from 'express';
import { inspectionController } from './inspection.controller';
import {
  CreateInspectionDto,
  UpdateInspectionDto,
  InspectionFilterDto,
} from './inspection.types';
import { validateDto } from '../../common/middlewares/validate';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '../auth/auth.types';

const router = Router();

router.post(
  '/inspections/search',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  validateDto(InspectionFilterDto),
  inspectionController.getInspections
);

router.post(
  '/inspections',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  validateDto(CreateInspectionDto),
  inspectionController.createInspection
);

router.get(
  '/inspections/:id',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  inspectionController.getInspectionById
);

router.patch(
  '/inspections/:id',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  validateDto(UpdateInspectionDto),
  inspectionController.updateInspection
);

router.delete(
  '/inspections/:id',
  authenticate,
  authorize(Role.ADMIN),
  inspectionController.deleteInspection
);

export default router;

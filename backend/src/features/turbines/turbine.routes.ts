import { Router } from 'express';
import { turbineController } from './turbine.controller';
import { CreateTurbineDto, UpdateTurbineDto } from './turbine.types';
import { validateDto } from '../../common/middlewares/validate';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '../auth/auth.types';

const router = Router();

// Public routes
router.get('/turbines', turbineController.getTurbines);

router.get('/turbines/:id', turbineController.getTurbineById);

// Protected routes (require authentication)
router.post(
  '/turbines',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  validateDto(CreateTurbineDto),
  turbineController.createTurbine
);

router.patch(
  '/turbines/:id',
  authenticate,
  authorize(Role.ADMIN, Role.ENGINEER),
  validateDto(UpdateTurbineDto),
  turbineController.updateTurbine
);

router.delete(
  '/turbines/:id',
  authenticate,
  authorize(Role.ADMIN),
  turbineController.deleteTurbine
);

export default router;

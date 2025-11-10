import { Router } from 'express';
import { turbineController } from './turbine.controller';
import { CreateTurbineDto, UpdateTurbineDto } from './turbine.types';
import { validateDto } from '../../common/middlewares/validate';
// import { authenticate } from '../../common/middlewares/auth';

const router = Router();

router.get('/turbines', turbineController.getTurbines);

router.get('/turbines/:id', turbineController.getTurbineById);

router.post(
  '/turbines',
  // authenticate, // Uncomment when auth is ready
  validateDto(CreateTurbineDto),
  turbineController.createTurbine
);

router.patch(
  '/turbines/:id',
  // authenticate, // Uncomment when auth is ready
  validateDto(UpdateTurbineDto),
  turbineController.updateTurbine
);

router.delete(
  '/turbines/:id',
  // authenticate, // Uncomment when auth is ready
  turbineController.deleteTurbine
);

export default router;

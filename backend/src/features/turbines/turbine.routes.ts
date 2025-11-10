import { Router } from 'express';
import { turbineController } from './turbine.controller';
// import { turbineValidation } from './turbine.validation';
// import { authenticate } from '../../common/middlewares/auth';

const router = Router();

router.get('/turbines', turbineController.getTurbines);

router.get('/turbines/:id', turbineController.getTurbineById);

// router.post(
//   '/turbines',
//   authenticate,
//   validate(turbineValidation.create),
//   turbineController.createTurbine
// );

// router.patch(
//   '/turbines/:id',
//   authenticate,
//   validate(turbineValidation.update),
//   turbineController.updateTurbine
// );

// router.delete(
//   '/turbines/:id',
//   authenticate,
//   turbineController.deleteTurbine
// );

export default router;

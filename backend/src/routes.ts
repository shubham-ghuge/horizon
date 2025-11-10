// routes/index.ts
import { Application } from 'express';
import turbineRoutes from './features/turbines/turbine.routes';
// import inspectionRoutes from './features/inspections/inspection.routes';
// import repairPlanRoutes from './features/repair-plans/repair-plan.routes';
// import notificationRoutes from './features/notifications/notification.routes';

export const registerRoutes = (app: Application) => {
  const API_PREFIX = '/api/v1';

  app.use(API_PREFIX, turbineRoutes);
  //   app.use(API_PREFIX, inspectionRoutes);
  //   app.use(API_PREFIX, repairPlanRoutes);
  //   app.use(API_PREFIX, notificationRoutes);
};

import { Router } from 'express';
import { body } from 'express-validator';
import * as routeController from '../controllers/route.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// All route endpoints require authentication
router.use(authenticate);

router.post(
  '/generate',
  [
    body('origin.lat').isFloat({ min: -90, max: 90 }),
    body('origin.lng').isFloat({ min: -180, max: 180 }),
    body('destination.lat').isFloat({ min: -90, max: 90 }),
    body('destination.lng').isFloat({ min: -180, max: 180 }),
  ],
  asyncHandler(routeController.generateRoute)
);

router.get('/saved', asyncHandler(routeController.getSavedRoutes));
router.post('/saved', asyncHandler(routeController.saveRoute));
router.get('/service-roads', asyncHandler(routeController.getServiceRoads));

router.post('/:id/analyze', asyncHandler(routeController.analyzeRouteById));
router.get('/:id/joining-roads', asyncHandler(routeController.getJoiningRoads));
router.get('/:id/alternates', asyncHandler(routeController.getAlternateRoutes));

export default router;

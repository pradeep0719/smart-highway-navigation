import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/stats', asyncHandler(adminController.getStats));
router.get('/users', asyncHandler(adminController.getUsers));
router.patch('/users/:id/role', asyncHandler(adminController.updateUserRole));
router.delete('/users/:id', asyncHandler(adminController.deleteUser));

export default router;

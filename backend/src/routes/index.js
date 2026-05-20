import { Router } from 'express';
import authRoutes from './auth.routes.js';
import routeRoutes from './route.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/routes', routeRoutes);
router.use('/admin', adminRoutes);

export default router;

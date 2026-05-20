import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { seedAdmin } from './utils/seed.js';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrls,
    credentials: true,
  })
);
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes — mounted at /api to match frontend VITE_API_URL
app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

/** Bootstrap server */
async function start() {
  await connectDB();
  await seedAdmin();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`API base: http://localhost:${env.port}/api`);
    console.log(`Environment: ${env.nodeEnv}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;

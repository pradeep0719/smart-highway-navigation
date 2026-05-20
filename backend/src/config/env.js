import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend root, project root, and deploy folder
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../deploy/.env') });

/** Parse comma-separated CORS origins */
function parseClientUrls(value) {
  return (value || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Validated environment configuration */
const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  clientUrls: parseClientUrls(process.env.CLIENT_URL),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-highway-nav',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  osrmBaseUrl: process.env.OSRM_BASE_URL || 'https://router.project-osrm.org',
  nominatimBaseUrl: process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org',
  overpassApiUrl: process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@smarthighway.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@12345',
};

export default env;

/** Application-wide constants */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Smart Highway Navigation';

export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export const OSRM_BASE_URL =
  import.meta.env.VITE_OSRM_BASE_URL || 'https://router.project-osrm.org';

export const NOMINATIM_BASE_URL =
  import.meta.env.VITE_NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';

/** Default map center (India - NH network hub approximation) */
export const DEFAULT_MAP_CENTER = { lat: 28.6139, lng: 77.209 };

export const DEFAULT_MAP_ZOOM = 12;

/** Road type colors for map polylines */
export const ROAD_TYPE_COLORS: Record<string, string> = {
  highway: '#0ea5e9',
  service: '#22c55e',
  joining: '#f59e0b',
  alternate: '#a855f7',
  local: '#64748b',
};

/** Token storage keys */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'shn_access_token',
  REFRESH_TOKEN: 'shn_refresh_token',
  THEME: 'shn_theme',
} as const;

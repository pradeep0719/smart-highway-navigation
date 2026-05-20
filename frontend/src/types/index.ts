/** Shared TypeScript types for the Smart Highway Navigation frontend */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteWaypoint extends LatLng {
  label?: string;
}

export type RoadType = 'highway' | 'service' | 'joining' | 'alternate' | 'local';

export interface RouteSegment {
  id: string;
  coordinates: LatLng[];
  distance: number; // meters
  duration: number; // seconds
  roadType: RoadType;
  name?: string;
  instructions?: string;
}

export interface NavigationRoute {
  id: string;
  origin: RouteWaypoint;
  destination: RouteWaypoint;
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  polyline: LatLng[];
  alternateRoutes?: NavigationRoute[];
}

export interface JoiningRoad {
  id: string;
  name: string;
  coordinates: LatLng[];
  distanceFromRoute: number;
  highwayRef?: string;
}

export interface ServiceRoad {
  id: string;
  name: string;
  coordinates: LatLng[];
  accessType: 'legal' | 'restricted' | 'emergency';
}

export interface RouteAnalysis {
  score: number; // 0-100
  safetyRating: 'low' | 'medium' | 'high';
  trafficLevel: 'light' | 'moderate' | 'heavy';
  highwayCoverage: number; // percentage
  joiningRoadsCount: number;
  serviceRoadsCount: number;
  warnings: string[];
  recommendations: string[];
}

export interface GeocodingResult {
  displayName: string;
  lat: number;
  lng: number;
  type?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalRoutes: number;
  activeSessions: number;
  routesToday: number;
}

export interface SavedRoute {
  id: string;
  name: string;
  origin: RouteWaypoint;
  destination: RouteWaypoint;
  createdAt: string;
  analysis?: RouteAnalysis;
}

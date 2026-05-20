import api from './api';
import type {
  JoiningRoad,
  NavigationRoute,
  RouteAnalysis,
  SavedRoute,
  ServiceRoad,
} from '../types';
import type { LatLng } from '../types';

export interface RouteRequest {
  origin: LatLng;
  destination: LatLng;
  waypoints?: LatLng[];
}

export const routeService = {
  async generateRoute(request: RouteRequest): Promise<NavigationRoute> {
    const { data } = await api.post<NavigationRoute>('/routes/generate', request);
    return data;
  },

  async analyzeRoute(routeId: string): Promise<RouteAnalysis> {
    const { data } = await api.post<RouteAnalysis>(`/routes/${routeId}/analyze`);
    return data;
  },

  async getJoiningRoads(routeId: string): Promise<JoiningRoad[]> {
    const { data } = await api.get<JoiningRoad[]>(`/routes/${routeId}/joining-roads`);
    return data;
  },

  async getServiceRoads(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<ServiceRoad[]> {
    const { data } = await api.get<ServiceRoad[]>('/routes/service-roads', { params: bounds });
    return data;
  },

  async getAlternateRoutes(routeId: string): Promise<NavigationRoute[]> {
    const { data } = await api.get<NavigationRoute[]>(`/routes/${routeId}/alternates`);
    return data;
  },

  async getSavedRoutes(): Promise<SavedRoute[]> {
    const { data } = await api.get<SavedRoute[]>('/routes/saved');
    return data;
  },

  async saveRoute(route: Partial<SavedRoute>): Promise<SavedRoute> {
    const { data } = await api.post<SavedRoute>('/routes/saved', route);
    return data;
  },
};

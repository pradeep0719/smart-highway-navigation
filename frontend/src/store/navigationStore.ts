import { create } from 'zustand';
import type {
  JoiningRoad,
  LatLng,
  NavigationRoute,
  RouteAnalysis,
  RouteWaypoint,
  ServiceRoad,
} from '../types';

interface NavigationState {
  origin: RouteWaypoint | null;
  destination: RouteWaypoint | null;
  activeRoute: NavigationRoute | null;
  alternateRoutes: NavigationRoute[];
  joiningRoads: JoiningRoad[];
  serviceRoads: ServiceRoad[];
  analysis: RouteAnalysis | null;
  isRouting: boolean;
  isAnalyzing: boolean;
  showServiceRoads: boolean;
  showJoiningRoads: boolean;
  selectedAlternateIndex: number | null;
  userLocation: LatLng | null;

  setOrigin: (wp: RouteWaypoint | null) => void;
  setDestination: (wp: RouteWaypoint | null) => void;
  setActiveRoute: (route: NavigationRoute | null) => void;
  setAlternateRoutes: (routes: NavigationRoute[]) => void;
  setJoiningRoads: (roads: JoiningRoad[]) => void;
  setServiceRoads: (roads: ServiceRoad[]) => void;
  setAnalysis: (analysis: RouteAnalysis | null) => void;
  setIsRouting: (v: boolean) => void;
  setIsAnalyzing: (v: boolean) => void;
  toggleServiceRoads: () => void;
  toggleJoiningRoads: () => void;
  setSelectedAlternateIndex: (index: number | null) => void;
  setUserLocation: (loc: LatLng | null) => void;
  resetNavigation: () => void;
}

/** Global navigation state for map and routing features */
export const useNavigationStore = create<NavigationState>((set) => ({
  origin: null,
  destination: null,
  activeRoute: null,
  alternateRoutes: [],
  joiningRoads: [],
  serviceRoads: [],
  analysis: null,
  isRouting: false,
  isAnalyzing: false,
  showServiceRoads: true,
  showJoiningRoads: true,
  selectedAlternateIndex: null,
  userLocation: null,

  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setActiveRoute: (activeRoute) => set({ activeRoute }),
  setAlternateRoutes: (alternateRoutes) => set({ alternateRoutes }),
  setJoiningRoads: (joiningRoads) => set({ joiningRoads }),
  setServiceRoads: (serviceRoads) => set({ serviceRoads }),
  setAnalysis: (analysis) => set({ analysis }),
  setIsRouting: (isRouting) => set({ isRouting }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  toggleServiceRoads: () => set((s) => ({ showServiceRoads: !s.showServiceRoads })),
  toggleJoiningRoads: () => set((s) => ({ showJoiningRoads: !s.showJoiningRoads })),
  setSelectedAlternateIndex: (selectedAlternateIndex) => set({ selectedAlternateIndex }),
  setUserLocation: (userLocation) => set({ userLocation }),
  resetNavigation: () =>
    set({
      origin: null,
      destination: null,
      activeRoute: null,
      alternateRoutes: [],
      joiningRoads: [],
      serviceRoads: [],
      analysis: null,
      selectedAlternateIndex: null,
    }),
}));

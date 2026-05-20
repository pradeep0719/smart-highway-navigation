import { NOMINATIM_BASE_URL, OSRM_BASE_URL } from '../utils/constants';
import type { GeocodingResult, LatLng } from '../types';

/**
 * OpenStreetMap / OSRM integration service (client-side fallback when backend unavailable)
 */
export const osmService = {
  /** Geocode address via Nominatim */
  async geocode(query: string): Promise<GeocodingResult[]> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: '5',
      addressdetails: '1',
    });
    const res = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    return data.map((item: { display_name: string; lat: string; lon: string; type?: string }) => ({
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
    }));
  },

  /** Reverse geocode coordinates */
  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: 'json',
    });
    const res = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`);
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    return data.display_name || `${lat}, ${lng}`;
  },

  /** Get driving route from OSRM */
  async getRoute(origin: LatLng, destination: LatLng): Promise<{
    coordinates: LatLng[];
    distance: number;
    duration: number;
  }> {
    const url = `${OSRM_BASE_URL}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Routing failed');
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) {
      throw new Error('No route found');
    }
    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
      lat,
      lng,
    }));
    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  },
};

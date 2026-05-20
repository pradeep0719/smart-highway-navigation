import env from '../config/env.js';

/**
 * OpenStreetMap integration — OSRM routing, Nominatim geocoding, Overpass queries
 */
export const osmService = {
  /** Get driving route from OSRM with optional alternatives */
  async getRoute(origin, destination, { alternatives = false } = {}) {
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const params = new URLSearchParams({
      overview: 'full',
      geometries: 'geojson',
      steps: 'true',
      ...(alternatives && { alternatives: 'true' }),
    });

    const url = `${env.osrmBaseUrl}/route/v1/driving/${coords}?${params}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM routing failed: ${res.status}`);

    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error('No route found between these points');
    }

    return data.routes.map((route) => parseOsrmRoute(route, origin, destination));
  },

  /** Reverse geocode coordinates via Nominatim */
  async reverseGeocode(lat, lng) {
    const params = new URLSearchParams({ lat: String(lat), lon: String(lng), format: 'json' });
    const res = await fetch(`${env.nominatimBaseUrl}/reverse?${params}`, {
      headers: { 'User-Agent': 'SmartHighwayNavigation/1.0' },
    });
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    return data.display_name;
  },

  /** Query Overpass API for highways/service roads in bounding box */
  async queryOverpass(bbox, roadTypes = ['motorway', 'trunk', 'primary', 'secondary']) {
    const [south, west, north, east] = bbox;
    void roadTypes; // reserved for future filter customization
    const query = `
      [out:json][timeout:25];
      (
        way["highway"~"motorway|trunk|primary|motorway_link|trunk_link"](${south},${west},${north},${east});
        way["highway"="service"]["service"](${south},${west},${north},${east});
      );
      out body geom;
    `;

    const res = await fetch(env.overpassApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!res.ok) {
      console.warn('Overpass query failed, returning empty');
      return [];
    }

    const data = await res.json();
    return data.elements || [];
  },
};

/** Parse single OSRM route into app format */
function parseOsrmRoute(route, origin, destination) {
  const coordinates = route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
  const segments = (route.legs || []).flatMap((leg, legIdx) =>
    (leg.steps || []).map((step, stepIdx) => ({
      id: `seg-${legIdx}-${stepIdx}`,
      coordinates: step.geometry?.coordinates?.map(([lng, lat]) => ({ lat, lng })) || [],
      distance: step.distance,
      duration: step.duration,
      roadType: classifyRoadType(step.name, step.maneuver?.type),
      name: step.name || undefined,
      instructions: step.maneuver?.instruction || step.name,
    }))
  );

  // Fallback single segment if no steps
  if (segments.length === 0) {
    segments.push({
      id: 'seg-0',
      coordinates,
      distance: route.distance,
      duration: route.duration,
      roadType: 'highway',
    });
  }

  return {
    origin: { ...origin, label: origin.label || 'Origin' },
    destination: { ...destination, label: destination.label || 'Destination' },
    segments,
    polyline: coordinates,
    totalDistance: route.distance,
    totalDuration: route.duration,
  };
}

/** Classify road segment type from OSM step metadata */
function classifyRoadType(name = '', maneuverType = '') {
  const n = (name || '').toLowerCase();
  if (n.includes('service') || maneuverType === 'off ramp') return 'service';
  if (n.includes('nh') || n.includes('highway') || n.includes('express')) return 'highway';
  if (maneuverType === 'merge' || maneuverType === 'fork') return 'joining';
  return 'local';
}

/** Compute bounding box from polyline with padding (degrees) */
export function bboxFromPolyline(polyline, padding = 0.02) {
  const lats = polyline.map((p) => p.lat);
  const lngs = polyline.map((p) => p.lng);
  return [
    Math.min(...lats) - padding,
    Math.min(...lngs) - padding,
    Math.max(...lats) + padding,
    Math.max(...lngs) + padding,
  ];
}

/** Haversine distance in meters between two points */
export function haversineDistance(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Minimum distance from point to polyline (approximate) */
export function distanceToPolyline(point, polyline) {
  let min = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = haversineDistance(point, polyline[i]);
    if (d < min) min = d;
  }
  return min;
}

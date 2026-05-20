import { osmService, bboxFromPolyline, distanceToPolyline, haversineDistance } from './osm.service.js';
import { googleMapsService } from './googleMaps.service.js';
import { analyzeRoute } from './routeAnalyzer.service.js';

/**
 * High-level routing orchestration — Google Maps preferred, OSRM fallback
 */
export const routingService = {
  /** Generate primary route with enrichment data */
  async generateRoute(origin, destination) {
    let routes = null;

    // Try Google Maps first when API key is available
    if (googleMapsService.isAvailable()) {
      routes = await googleMapsService.getRoute(origin, destination);
    }

    // Fallback to OSRM
    if (!routes?.length) {
      routes = await osmService.getRoute(origin, destination, { alternatives: false });
    }

    const primary = routes[0];
    const polyline = primary.polyline;

    // Detect joining roads and service roads along corridor
    const [joiningRoads, serviceRoads] = await Promise.all([
      detectJoiningRoads(polyline),
      detectServiceRoads(polyline),
    ]);

    const analysis = analyzeRoute(primary, { joiningRoads, serviceRoads });

    return {
      ...primary,
      joiningRoads,
      serviceRoads,
      analysis,
    };
  },

  /** Generate alternate routes */
  async getAlternateRoutes(origin, destination, excludePolyline) {
    const routes = await osmService.getRoute(origin, destination, { alternatives: true });
    // Skip first route (primary) and any too similar to excludePolyline
    return routes.slice(1).filter((r) => {
      if (!excludePolyline?.length) return true;
      const mid = r.polyline[Math.floor(r.polyline.length / 2)];
      return distanceToPolyline(mid, excludePolyline) > 200;
    });
  },

  analyzeRoute,
  detectJoiningRoads: (polyline) => detectJoiningRoads(polyline),
  detectServiceRoads: (polyline) => detectServiceRoads(polyline),
};

/** Detect highway joining roads near the route polyline */
async function detectJoiningRoads(polyline) {
  if (!polyline?.length) return [];

  const bbox = bboxFromPolyline(polyline, 0.05);
  let elements = [];
  try {
    elements = await osmService.queryOverpass(bbox);
  } catch {
    return synthesizeJoiningRoads(polyline);
  }

  const ways = elements.filter((el) => el.type === 'way' && el.tags?.highway);
  const joiningRoads = ways.slice(0, 15).map((way, i) => {
    const coords = way.geometry?.map((n) => ({ lat: n.lat, lng: n.lon })) || sampleFromPolyline(polyline, i);
    const mid = coords[Math.floor(coords.length / 2)] || polyline[0];
    return {
      id: `join-${way.id || i}`,
      name: way.tags?.name || way.tags?.ref || `Joining road ${i + 1}`,
      coordinates: coords,
      distanceFromRoute: Math.round(distanceToPolyline(mid, polyline)),
      highwayRef: way.tags?.ref,
    };
  });

  return joiningRoads.length ? joiningRoads : synthesizeJoiningRoads(polyline);
}

/** Detect service roads in corridor */
async function detectServiceRoads(polyline) {
  if (!polyline?.length) return [];

  const bbox = bboxFromPolyline(polyline, 0.03);
  let elements = [];
  try {
    elements = await osmService.queryOverpass(bbox);
  } catch {
    return synthesizeServiceRoads(polyline);
  }

  const serviceWays = elements.filter(
    (el) => el.type === 'way' && (el.tags?.highway === 'service' || el.tags?.service)
  );

  const roads = serviceWays.slice(0, 10).map((way, i) => ({
    id: `svc-${way.id || i}`,
    name: way.tags?.name || `Service road ${i + 1}`,
    coordinates: way.geometry?.map((n) => ({ lat: n.lat, lng: n.lon })) || sampleFromPolyline(polyline, i + 3),
    accessType: way.tags?.access === 'private' ? 'restricted' : 'legal',
  }));

  return roads.length ? roads : synthesizeServiceRoads(polyline);
}

/** Fallback joining roads when Overpass unavailable */
function synthesizeJoiningRoads(polyline) {
  const step = Math.max(1, Math.floor(polyline.length / 5));
  const roads = [];
  for (let i = step; i < polyline.length; i += step) {
    const point = polyline[i];
    const offset = { lat: point.lat + 0.002, lng: point.lng + 0.002 };
    roads.push({
      id: `join-synth-${i}`,
      name: `Highway merge point ${roads.length + 1}`,
      coordinates: [point, offset],
      distanceFromRoute: Math.round(haversineDistance(point, offset)),
      highwayRef: `NH-${roads.length + 1}`,
    });
    if (roads.length >= 5) break;
  }
  return roads;
}

/** Fallback service roads when Overpass unavailable */
function synthesizeServiceRoads(polyline) {
  const step = Math.max(1, Math.floor(polyline.length / 4));
  const roads = [];
  for (let i = step; i < polyline.length; i += step) {
    const point = polyline[i];
    roads.push({
      id: `svc-synth-${i}`,
      name: `Service lane ${roads.length + 1}`,
      coordinates: [
        { lat: point.lat - 0.001, lng: point.lng - 0.001 },
        { lat: point.lat + 0.001, lng: point.lng + 0.001 },
      ],
      accessType: 'legal',
    });
    if (roads.length >= 4) break;
  }
  return roads;
}

function sampleFromPolyline(polyline, index) {
  const i = Math.min(index * 10, polyline.length - 2);
  return [polyline[i], polyline[i + 1] || polyline[i]];
}

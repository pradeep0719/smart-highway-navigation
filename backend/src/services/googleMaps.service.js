import env from '../config/env.js';

/**
 * Google Maps Directions API integration (optional enhancement)
 * Falls back gracefully when API key is not configured
 */
export const googleMapsService = {
  isAvailable() {
    return Boolean(env.googleMapsApiKey);
  },

  /** Get route via Google Directions API */
  async getRoute(origin, destination) {
    if (!this.isAvailable()) return null;

    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      key: env.googleMapsApiKey,
      mode: 'driving',
      alternatives: 'true',
    });

    const url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 'OK' || !data.routes?.length) return null;

    return data.routes.map((route) => {
      const leg = route.legs[0];
      const polyline = decodePolyline(route.overview_polyline.points);
      return {
        origin: { ...origin, label: origin.label || leg.start_address },
        destination: { ...destination, label: destination.label || leg.end_address },
        segments: [
          {
            id: 'seg-google-0',
            coordinates: polyline,
            distance: leg.distance.value,
            duration: leg.duration.value,
            roadType: 'highway',
          },
        ],
        polyline,
        totalDistance: leg.distance.value,
        totalDuration: leg.duration.value,
      };
    });
  },
};

/** Decode Google encoded polyline */
function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

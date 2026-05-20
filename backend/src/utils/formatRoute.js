/** Transform stored route document to frontend NavigationRoute shape */
export function formatNavigationRoute(doc, { includeAlternates = false } = {}) {
  const route = {
    id: doc._id.toString(),
    origin: doc.origin,
    destination: doc.destination,
    segments: doc.segments || [],
    totalDistance: doc.totalDistance,
    totalDuration: doc.totalDuration,
    polyline: doc.polyline || [],
  };

  if (includeAlternates && doc.alternateRoutes?.length) {
    route.alternateRoutes = doc.alternateRoutes.map((alt, i) => ({
      id: alt.id || `alt-${doc._id}-${i}`,
      origin: alt.origin || doc.origin,
      destination: alt.destination || doc.destination,
      segments: alt.segments || [],
      totalDistance: alt.totalDistance,
      totalDuration: alt.totalDuration,
      polyline: alt.polyline || [],
    }));
  }

  return route;
}

export function formatSavedRoute(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    origin: doc.origin,
    destination: doc.destination,
    createdAt: doc.createdAt.toISOString(),
    analysis: doc.analysis,
  };
}

import { validationResult } from 'express-validator';
import NavigationRoute from '../models/NavigationRoute.js';
import SavedRoute from '../models/SavedRoute.js';
import { routingService } from '../services/routing.service.js';
import { formatNavigationRoute, formatSavedRoute } from '../utils/formatRoute.js';
import { analyzeRoute } from '../services/routeAnalyzer.service.js';

/** POST /routes/generate */
export async function generateRoute(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { origin, destination } = req.body;
  const routeData = await routingService.generateRoute(origin, destination);

  const doc = await NavigationRoute.create({
    userId: req.user._id,
    origin: routeData.origin,
    destination: routeData.destination,
    segments: routeData.segments,
    polyline: routeData.polyline,
    totalDistance: routeData.totalDistance,
    totalDuration: routeData.totalDuration,
    joiningRoads: routeData.joiningRoads,
    serviceRoads: routeData.serviceRoads,
    analysis: routeData.analysis,
  });

  res.status(201).json(formatNavigationRoute(doc));
}

/** POST /routes/:id/analyze */
export async function analyzeRouteById(req, res) {
  const doc = await NavigationRoute.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!doc) return res.status(404).json({ message: 'Route not found' });

  const analysis = analyzeRoute(doc, {
    joiningRoads: doc.joiningRoads,
    serviceRoads: doc.serviceRoads,
  });

  doc.analysis = analysis;
  await doc.save();

  res.json(analysis);
}

/** GET /routes/:id/joining-roads */
export async function getJoiningRoads(req, res) {
  const doc = await NavigationRoute.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!doc) return res.status(404).json({ message: 'Route not found' });

  if (!doc.joiningRoads?.length && doc.polyline?.length) {
    doc.joiningRoads = await routingService.detectJoiningRoads(doc.polyline);
    await doc.save();
  }

  res.json(doc.joiningRoads || []);
}

/** GET /routes/service-roads?north&south&east&west */
export async function getServiceRoads(req, res) {
  const { north, south, east, west } = req.query;
  const n = parseFloat(north);
  const s = parseFloat(south);
  const e = parseFloat(east);
  const w = parseFloat(west);

  if ([n, s, e, w].some(isNaN)) {
    return res.status(400).json({ message: 'Bounds required: north, south, east, west' });
  }

  const polyline = [
    { lat: s, lng: w },
    { lat: n, lng: e },
    { lat: (s + n) / 2, lng: (e + w) / 2 },
  ];
  const roads = await routingService.detectServiceRoads(polyline);
  res.json(roads);
}

/** GET /routes/:id/alternates */
export async function getAlternateRoutes(req, res) {
  const doc = await NavigationRoute.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!doc) return res.status(404).json({ message: 'Route not found' });

  if (!doc.alternateRoutes?.length) {
    const alternates = await routingService.getAlternateRoutes(
      doc.origin,
      doc.destination,
      doc.polyline
    );
    doc.alternateRoutes = alternates;
    await doc.save();
  }

  const formatted = (doc.alternateRoutes || []).map((alt, i) => ({
    id: alt.id || `alt-${doc._id}-${i}`,
    origin: alt.origin || doc.origin,
    destination: alt.destination || doc.destination,
    segments: alt.segments || [],
    totalDistance: alt.totalDistance,
    totalDuration: alt.totalDuration,
    polyline: alt.polyline || [],
  }));

  res.json(formatted);
}

/** GET /routes/saved */
export async function getSavedRoutes(req, res) {
  const routes = await SavedRoute.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(routes.map(formatSavedRoute));
}

/** POST /routes/saved */
export async function saveRoute(req, res) {
  const { name, origin, destination, routeId, analysis } = req.body;
  if (!name || !origin || !destination) {
    return res.status(400).json({ message: 'name, origin, and destination are required' });
  }

  const doc = await SavedRoute.create({
    userId: req.user._id,
    name,
    origin,
    destination,
    routeId,
    analysis,
  });

  res.status(201).json(formatSavedRoute(doc));
}

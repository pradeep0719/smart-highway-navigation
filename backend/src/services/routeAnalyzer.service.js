/**
 * Smart route analyzer — computes safety score, warnings, and recommendations
 */
export function analyzeRoute(route, { joiningRoads = [], serviceRoads = [] } = {}) {
  const segments = route.segments || [];
  const totalDist = route.totalDistance || 1;

  // Highway coverage: fraction of distance on highway-type segments
  const highwayDist = segments
    .filter((s) => s.roadType === 'highway')
    .reduce((sum, s) => sum + (s.distance || 0), 0);
  const highwayCoverage = Math.round((highwayDist / totalDist) * 100);

  const serviceCount = serviceRoads.length;
  const joiningCount = joiningRoads.length;

  // Composite score 0-100
  let score = 50;
  score += Math.min(highwayCoverage * 0.3, 30);
  score += Math.min(joiningCount * 2, 10);
  score += serviceCount > 0 ? 5 : 0;
  score -= segments.filter((s) => s.roadType === 'local').length * 3;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const safetyRating = score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

  // Simulated traffic based on duration/distance ratio (km/h)
  const avgSpeedKmh = totalDist > 0 ? (totalDist / 1000) / ((route.totalDuration || 1) / 3600) : 60;
  const trafficLevel = avgSpeedKmh < 30 ? 'heavy' : avgSpeedKmh < 50 ? 'moderate' : 'light';

  const warnings = [];
  const recommendations = [];

  if (highwayCoverage < 50) {
    warnings.push('Less than 50% of route uses major highways — expect slower travel.');
  }
  if (joiningCount > 5) {
    warnings.push(`High merge density: ${joiningCount} joining roads detected along corridor.`);
  }
  if (avgSpeedKmh < 25) {
    warnings.push('Predicted average speed is low — possible congestion.');
  }

  if (serviceCount > 0) {
    recommendations.push(`${serviceCount} service road(s) available for legal stops and access.`);
  }
  if (highwayCoverage >= 70) {
    recommendations.push('Route primarily uses national highways — optimal for long-distance travel.');
  }
  if (joiningCount > 0) {
    recommendations.push('Review joining road panel before merging onto main carriageway.');
  }

  return {
    score,
    safetyRating,
    trafficLevel,
    highwayCoverage,
    joiningRoadsCount: joiningCount,
    serviceRoadsCount: serviceCount,
    warnings,
    recommendations,
  };
}

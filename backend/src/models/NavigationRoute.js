import mongoose from 'mongoose';

const latLngSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    label: String,
  },
  { _id: false }
);

const segmentSchema = new mongoose.Schema(
  {
    id: String,
    coordinates: [latLngSchema],
    distance: Number,
    duration: Number,
    roadType: {
      type: String,
      enum: ['highway', 'service', 'joining', 'alternate', 'local'],
      default: 'highway',
    },
    name: String,
    instructions: String,
  },
  { _id: false }
);

const joiningRoadSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    coordinates: [latLngSchema],
    distanceFromRoute: Number,
    highwayRef: String,
  },
  { _id: false }
);

const serviceRoadSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    coordinates: [latLngSchema],
    accessType: { type: String, enum: ['legal', 'restricted', 'emergency'], default: 'legal' },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    score: Number,
    safetyRating: { type: String, enum: ['low', 'medium', 'high'] },
    trafficLevel: { type: String, enum: ['light', 'moderate', 'heavy'] },
    highwayCoverage: Number,
    joiningRoadsCount: Number,
    serviceRoadsCount: Number,
    warnings: [String],
    recommendations: [String],
  },
  { _id: false }
);

/** Stored navigation route with enrichment data */
const navigationRouteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    origin: { type: latLngSchema, required: true },
    destination: { type: latLngSchema, required: true },
    segments: [segmentSchema],
    polyline: [latLngSchema],
    totalDistance: { type: Number, default: 0 },
    totalDuration: { type: Number, default: 0 },
    joiningRoads: [joiningRoadSchema],
    serviceRoads: [serviceRoadSchema],
    alternateRoutes: [{ type: mongoose.Schema.Types.Mixed }],
    analysis: analysisSchema,
  },
  { timestamps: true }
);

const NavigationRoute = mongoose.model('NavigationRoute', navigationRouteSchema);
export default NavigationRoute;

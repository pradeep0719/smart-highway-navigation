import mongoose from 'mongoose';

const waypointSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
    label: String,
  },
  { _id: false }
);

/** User-saved favorite routes */
const savedRouteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    origin: waypointSchema,
    destination: waypointSchema,
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'NavigationRoute' },
    analysis: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

const SavedRoute = mongoose.model('SavedRoute', savedRouteSchema);
export default SavedRoute;

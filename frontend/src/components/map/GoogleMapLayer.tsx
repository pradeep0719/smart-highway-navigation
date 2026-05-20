import { useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_CENTER, ROAD_TYPE_COLORS } from '../../utils/constants';
import { useNavigationStore } from '../../store/navigationStore';

const mapContainerStyle = { width: '100%', height: '100%' };

interface GoogleMapLayerProps {
  className?: string;
}

/**
 * Google Maps layer - used when VITE_GOOGLE_MAPS_API_KEY is configured
 * Falls back to LiveMap (Leaflet/OSM) when key is missing
 */
export default function GoogleMapLayer({ className = 'h-full min-h-[400px]' }: GoogleMapLayerProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: 'google-map-script',
  });

  const {
    origin,
    destination,
    activeRoute,
    joiningRoads,
    serviceRoads,
    showJoiningRoads,
    showServiceRoads,
    userLocation,
  } = useNavigationStore();

  const center = useMemo(() => {
    if (origin) return { lat: origin.lat, lng: origin.lng };
    if (userLocation) return userLocation;
    return DEFAULT_MAP_CENTER;
  }, [origin, userLocation]);

  const onMapClick = useCallback(() => {
    // Map click handled by parent via LiveMap fallback
  }, []);

  if (!GOOGLE_MAPS_API_KEY) return null;
  if (loadError) return null;
  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-highway-200 border-t-highway-600" />
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onClick={onMapClick}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          streetViewControl: false,
        }}
      >
        {origin && <Marker position={origin} label="A" />}
        {destination && <Marker position={destination} label="B" />}
        {userLocation && <Marker position={userLocation} />}
        {activeRoute && (
          <Polyline
            path={activeRoute.polyline}
            options={{ strokeColor: ROAD_TYPE_COLORS.highway, strokeWeight: 6 }}
          />
        )}
        {showServiceRoads &&
          serviceRoads.map((road) => (
            <Polyline
              key={road.id}
              path={road.coordinates}
              options={{ strokeColor: ROAD_TYPE_COLORS.service, strokeWeight: 4 }}
            />
          ))}
        {showJoiningRoads &&
          joiningRoads.map((road) => (
            <Polyline
              key={road.id}
              path={road.coordinates}
              options={{ strokeColor: ROAD_TYPE_COLORS.joining, strokeWeight: 3 }}
            />
          ))}
      </GoogleMap>
    </div>
  );
}

/** Returns true if Google Maps should be the primary map provider */
export function useGoogleMapsAvailable(): boolean {
  return Boolean(GOOGLE_MAPS_API_KEY);
}

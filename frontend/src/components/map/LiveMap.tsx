import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigationStore } from '../../store/navigationStore';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, ROAD_TYPE_COLORS } from '../../utils/constants';
import type { LatLng } from '../../types';

// Fix default marker icons in Vite bundler
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const originIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#0ea5e9;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#ef4444;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

/** Auto-fit map bounds when route changes */
function MapBoundsController({ points }: { points: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, points]);
  return null;
}

interface LiveMapProps {
  className?: string;
  onMapClick?: (latlng: LatLng) => void;
}

/**
 * Live map component using Leaflet + OpenStreetMap tiles
 * (Google Maps overlay available via MapProvider when API key is set)
 */
export default function LiveMap({ className = 'h-full min-h-[400px]', onMapClick }: LiveMapProps) {
  const {
    origin,
    destination,
    activeRoute,
    joiningRoads,
    serviceRoads,
    showJoiningRoads,
    showServiceRoads,
    userLocation,
    alternateRoutes,
    selectedAlternateIndex,
  } = useNavigationStore();

  const center = useMemo(() => {
    if (origin) return [origin.lat, origin.lng] as [number, number];
    if (userLocation) return [userLocation.lat, userLocation.lng] as [number, number];
    return [DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng] as [number, number];
  }, [origin, userLocation]);

  const routePoints = activeRoute?.polyline ?? [];
  const displayAlternate =
    selectedAlternateIndex !== null ? alternateRoutes[selectedAlternateIndex] : null;

  const MapClickHandler = () => {
    const map = useMap();
    useEffect(() => {
      if (!onMapClick) return;
      const handler = (e: L.LeafletMouseEvent) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      };
      map.on('click', handler);
      return () => {
        map.off('click', handler);
      };
    }, [map]);
    return null;
  };

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={DEFAULT_MAP_ZOOM}
        className="h-full w-full rounded-xl"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {routePoints.length > 0 && <MapBoundsController points={routePoints} />}

        {origin && (
          <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
            <Popup>Origin: {origin.label || 'Start'}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
            <Popup>Destination: {destination.label || 'End'}</Popup>
          </Marker>
        )}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {activeRoute && (
          <Polyline
            positions={activeRoute.polyline.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{ color: ROAD_TYPE_COLORS.highway, weight: 6, opacity: 0.9 }}
          />
        )}

        {displayAlternate && (
          <Polyline
            positions={displayAlternate.polyline.map((p) => [p.lat, p.lng] as [number, number])}
            pathOptions={{
              color: ROAD_TYPE_COLORS.alternate,
              weight: 5,
              opacity: 0.7,
              dashArray: '10, 10',
            }}
          />
        )}

        {showServiceRoads &&
          serviceRoads.map((road) => (
            <Polyline
              key={road.id}
              positions={road.coordinates.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: ROAD_TYPE_COLORS.service, weight: 4, opacity: 0.8 }}
            />
          ))}

        {showJoiningRoads &&
          joiningRoads.map((road) => (
            <Polyline
              key={road.id}
              positions={road.coordinates.map((p) => [p.lat, p.lng] as [number, number])}
              pathOptions={{ color: ROAD_TYPE_COLORS.joining, weight: 3, opacity: 0.75 }}
            />
          ))}
      </MapContainer>
    </div>
  );
}

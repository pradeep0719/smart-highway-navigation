import LiveMap from './LiveMap';
import GoogleMapLayer, { useGoogleMapsAvailable } from './GoogleMapLayer';
import type { LatLng } from '../../types';

interface MapProviderProps {
  className?: string;
  onMapClick?: (latlng: LatLng) => void;
}

/**
 * Unified map provider - prefers Google Maps when API key is available,
 * otherwise uses Leaflet with OpenStreetMap tiles
 */
export default function MapProvider({ className, onMapClick }: MapProviderProps) {
  const hasGoogle = useGoogleMapsAvailable();

  if (hasGoogle) {
    return <GoogleMapLayer className={className} />;
  }

  return <LiveMap className={className} onMapClick={onMapClick} />;
}

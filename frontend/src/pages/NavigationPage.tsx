import { useEffect } from 'react';
import MapProvider from '../components/map/MapProvider';
import RouteSearchPanel from '../components/route/RouteSearchPanel';
import RouteInfoPanel from '../components/route/RouteInfoPanel';
import SmartRouteAnalyzer from '../components/route/SmartRouteAnalyzer';
import JoiningRoadsPanel from '../components/route/JoiningRoadsPanel';
import ServiceRoadsPanel from '../components/route/ServiceRoadsPanel';
import AlternateRoutesPanel from '../components/route/AlternateRoutesPanel';
import VoiceNavigationControl from '../components/navigation/VoiceNavigationControl';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNavigationStore } from '../store/navigationStore';
import { osmService } from '../services/osmService';
import toast from 'react-hot-toast';

/** Main navigation page with live map and route tools */
export default function NavigationPage() {
  const { setUserLocation, setDestination } = useNavigationStore();
  const { location, requestLocation } = useGeolocation(true);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (location) setUserLocation(location);
  }, [location, setUserLocation]);

  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    try {
      const label = await osmService.reverseGeocode(latlng.lat, latlng.lng);
      setDestination({ ...latlng, label });
      toast.success('Destination set from map click');
    } catch {
      setDestination({ ...latlng, label: `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}` });
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Sidebar controls */}
      <aside className="order-2 flex w-full flex-col gap-3 overflow-y-auto border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 lg:order-1 lg:w-96 lg:border-r lg:border-t-0">
        <RouteSearchPanel />
        <RouteInfoPanel />
        <VoiceNavigationControl />
        <JoiningRoadsPanel />
        <ServiceRoadsPanel />
        <AlternateRoutesPanel />
        <SmartRouteAnalyzer />
      </aside>

      {/* Map area */}
      <div className="relative order-1 min-h-[50vh] flex-1 lg:order-2 lg:min-h-0">
        <MapProvider className="absolute inset-0 h-full" onMapClick={handleMapClick} />
      </div>
    </div>
  );
}

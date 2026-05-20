import { useState } from 'react';
import { MapPin, Navigation, Locate, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { osmService } from '../../services/osmService';
import { useNavigationStore } from '../../store/navigationStore';
import { useRouteGeneration } from '../../hooks/useRouteGeneration';
import { useGeolocation } from '../../hooks/useGeolocation';
import Button from '../ui/Button';
import type { GeocodingResult } from '../../types';

/** Origin/destination search and route generation panel */
export default function RouteSearchPanel() {
  const { origin, destination, isRouting, setOrigin, setDestination } = useNavigationStore();
  const { generateRoute } = useRouteGeneration();
  const { requestLocation } = useGeolocation();

  const [originQuery, setOriginQuery] = useState(origin?.label || '');
  const [destQuery, setDestQuery] = useState(destination?.label || '');
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);

  const searchPlaces = async (query: string, field: 'origin' | 'destination') => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setActiveField(field);
    try {
      const results = await osmService.geocode(query);
      setSuggestions(results);
    } catch {
      toast.error('Search failed');
    }
  };

  const selectPlace = (place: GeocodingResult, field: 'origin' | 'destination') => {
    const waypoint = { lat: place.lat, lng: place.lng, label: place.displayName };
    if (field === 'origin') {
      setOrigin(waypoint);
      setOriginQuery(place.displayName);
    } else {
      setDestination(waypoint);
      setDestQuery(place.displayName);
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const swapPoints = () => {
    const o = origin;
    const d = destination;
    setOrigin(d);
    setDestination(o);
    setOriginQuery(d?.label || '');
    setDestQuery(o?.label || '');
  };

  const useMyLocation = async () => {
    requestLocation();
    const loc = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null)
      );
    });
    if (!loc) {
      toast.error('Could not get location');
      return;
    }
    const label = await osmService.reverseGeocode(loc.lat, loc.lng);
    setOrigin({ ...loc, label });
    setOriginQuery(label);
    toast.success('Location set as origin');
  };

  return (
    <div className="glass-panel space-y-4 p-4">
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
        Plan your route
      </h2>

      <div className="relative space-y-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-highway-500" />
          <input
            className="input-field pl-10"
            placeholder="Origin"
            value={originQuery}
            onChange={(e) => {
              setOriginQuery(e.target.value);
              searchPlaces(e.target.value, 'origin');
            }}
          />
          {activeField === 'origin' && suggestions.length > 0 && (
            <SuggestionList suggestions={suggestions} onSelect={(p) => selectPlace(p, 'origin')} />
          )}
        </div>

        <button
          type="button"
          onClick={swapPoints}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-100 p-1.5 dark:bg-slate-800"
          aria-label="Swap origin and destination"
        >
          <ArrowLeftRight className="h-4 w-4 text-slate-600" />
        </button>

        <div className="relative">
          <Navigation className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
          <input
            className="input-field pl-10"
            placeholder="Destination"
            value={destQuery}
            onChange={(e) => {
              setDestQuery(e.target.value);
              searchPlaces(e.target.value, 'destination');
            }}
          />
          {activeField === 'destination' && suggestions.length > 0 && (
            <SuggestionList
              suggestions={suggestions}
              onSelect={(p) => selectPlace(p, 'destination')}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={useMyLocation}>
          <Locate className="h-4 w-4" />
          My location
        </Button>
      </div>

      <Button className="w-full" onClick={generateRoute} isLoading={isRouting} disabled={!origin || !destination}>
        Generate route
      </Button>
    </div>
  );
}

function SuggestionList({
  suggestions,
  onSelect,
}: {
  suggestions: GeocodingResult[];
  onSelect: (place: GeocodingResult) => void;
}) {
  return (
    <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
      {suggestions.map((s, i) => (
        <li key={i}>
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            onClick={() => onSelect(s)}
          >
            {s.displayName}
          </button>
        </li>
      ))}
    </ul>
  );
}

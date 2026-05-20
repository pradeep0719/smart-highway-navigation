import { useCallback, useEffect, useState } from 'react';
import type { LatLng } from '../types';

interface GeolocationState {
  location: LatLng | null;
  error: string | null;
  isLoading: boolean;
}

/** Hook for browser geolocation with permission handling */
export function useGeolocation(watch = false) {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    isLoading: false,
  });

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      location: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      error: null,
      isLoading: false,
    });
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setState((s) => ({
      ...s,
      error: err.message,
      isLoading: false,
    }));
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ location: null, error: 'Geolocation not supported', isLoading: false });
      return;
    }
    setState((s) => ({ ...s, isLoading: true, error: null }));
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }, [handleSuccess, handleError]);

  useEffect(() => {
    if (!watch) return;
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
    });
    return () => navigator.geolocation.clearWatch(id);
  }, [watch, handleSuccess, handleError]);

  return { ...state, requestLocation };
}

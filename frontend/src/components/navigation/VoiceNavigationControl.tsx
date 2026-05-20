import { Volume2, VolumeX, Mic } from 'lucide-react';
import { useState } from 'react';
import { useVoiceNavigation } from '../../hooks/useVoiceNavigation';
import { useNavigationStore } from '../../store/navigationStore';
import Button from '../ui/Button';

/** Voice navigation toggle and test controls */
export default function VoiceNavigationControl() {
  const [enabled, setEnabled] = useState(true);
  const { speak, stop, isSpeaking, isSupported } = useVoiceNavigation({ enabled });
  const { activeRoute } = useNavigationStore();

  const announceRoute = () => {
    if (!activeRoute) return;
    const mins = Math.round(activeRoute.totalDuration / 60);
    const km = (activeRoute.totalDistance / 1000).toFixed(1);
    speak(`Your route is ${km} kilometers and will take approximately ${mins} minutes. Begin navigation when ready.`);
  };

  if (!isSupported) {
    return (
      <p className="text-xs text-slate-500">Voice navigation is not supported in this browser.</p>
    );
  }

  return (
    <div className="glass-panel flex items-center justify-between gap-3 p-3">
      <div className="flex items-center gap-2">
        <Mic className="h-5 w-5 text-highway-600" />
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Voice navigation</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked);
              if (!e.target.checked) stop();
            }}
            className="rounded border-slate-300 text-highway-600"
          />
          On
        </label>
        {activeRoute && (
          <Button variant="ghost" size="sm" onClick={announceRoute} disabled={!enabled || isSpeaking}>
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
        {isSpeaking && (
          <button type="button" onClick={stop} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
            <VolumeX className="h-4 w-4 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}

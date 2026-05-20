import { Shuffle } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';
import { formatDistance, formatDuration } from '../../utils/format';
import Button from '../ui/Button';

/** Alternate legal access route suggestions */
export default function AlternateRoutesPanel() {
  const {
    alternateRoutes,
    selectedAlternateIndex,
    setSelectedAlternateIndex,
    setActiveRoute,
    activeRoute,
  } = useNavigationStore();

  if (alternateRoutes.length === 0) return null;

  const selectAlternate = (index: number) => {
    setSelectedAlternateIndex(index === selectedAlternateIndex ? null : index);
  };

  const applyAlternate = (index: number) => {
    const alt = alternateRoutes[index];
    if (alt) {
      setActiveRoute(alt);
      setSelectedAlternateIndex(null);
    }
  };

  return (
    <div className="glass-panel space-y-3 p-4">
      <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
        <Shuffle className="h-5 w-5 text-purple-500" />
        Alternate routes
      </h3>
      <p className="text-xs text-slate-500">Legal alternate access paths to your destination</p>

      <ul className="space-y-2">
        {alternateRoutes.map((route, index) => (
          <li
            key={route.id}
            className={`rounded-lg border p-3 transition ${
              selectedAlternateIndex === index
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Option {index + 1}</span>
              <span className="text-slate-500">
                {formatDistance(route.totalDistance)} · {formatDuration(route.totalDuration)}
              </span>
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => selectAlternate(index)}>
                Preview
              </Button>
              {activeRoute?.id !== route.id && (
                <Button size="sm" onClick={() => applyAlternate(index)}>
                  Use route
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

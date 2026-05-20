import { Clock, Route } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';
import { formatDistance, formatDuration } from '../../utils/format';
import Badge from '../ui/Badge';

/** Displays active route summary (distance, duration) */
export default function RouteInfoPanel() {
  const { activeRoute } = useNavigationStore();

  if (!activeRoute) {
    return (
      <div className="glass-panel p-4 text-center text-sm text-slate-500">
        Generate a route to see details
      </div>
    );
  }

  return (
    <div className="glass-panel space-y-3 p-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Route summary</h3>
      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Route} label="Distance" value={formatDistance(activeRoute.totalDistance)} />
        <Stat icon={Clock} label="Duration" value={formatDuration(activeRoute.totalDuration)} />
      </div>
      {activeRoute.segments.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeRoute.segments.map((seg) => (
            <Badge key={seg.id} variant="info">
              {seg.roadType}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
      <Icon className="h-5 w-5 text-highway-600" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

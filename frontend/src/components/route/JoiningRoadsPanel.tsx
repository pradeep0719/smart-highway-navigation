import { GitBranch } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';
import { formatDistance } from '../../utils/format';
import Badge from '../ui/Badge';

/** Panel listing nearby highway joining roads detected along the route */
export default function JoiningRoadsPanel() {
  const { joiningRoads, showJoiningRoads, toggleJoiningRoads } = useNavigationStore();

  return (
    <div className="glass-panel space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <GitBranch className="h-5 w-5 text-amber-500" />
          Joining roads
        </h3>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showJoiningRoads}
            onChange={toggleJoiningRoads}
            className="rounded border-slate-300 text-highway-600 focus:ring-highway-500"
          />
          Show on map
        </label>
      </div>

      {joiningRoads.length === 0 ? (
        <p className="text-sm text-slate-500">No joining roads detected yet. Generate a route first.</p>
      ) : (
        <ul className="max-h-40 space-y-2 overflow-y-auto">
          {joiningRoads.map((road) => (
            <li
              key={road.id}
              className="flex items-start justify-between rounded-lg bg-slate-50 p-2 text-sm dark:bg-slate-800/50"
            >
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">{road.name}</p>
                {road.highwayRef && (
                  <Badge variant="warning" className="mt-1">
                    {road.highwayRef}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-slate-500">{formatDistance(road.distanceFromRoute)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

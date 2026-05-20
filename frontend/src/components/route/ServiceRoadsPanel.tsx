import { Route } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';
import Badge from '../ui/Badge';

/** Service road highlighting and legal access info */
export default function ServiceRoadsPanel() {
  const { serviceRoads, showServiceRoads, toggleServiceRoads } = useNavigationStore();

  return (
    <div className="glass-panel space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Route className="h-5 w-5 text-green-500" />
          Service roads
        </h3>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showServiceRoads}
            onChange={toggleServiceRoads}
            className="rounded border-slate-300 text-highway-600 focus:ring-highway-500"
          />
          Highlight
        </label>
      </div>

      <p className="text-xs text-slate-500">
        Green highlights indicate service roads along your highway corridor.
      </p>

      {serviceRoads.length === 0 ? (
        <p className="text-sm text-slate-500">Service roads will appear after route analysis.</p>
      ) : (
        <ul className="max-h-36 space-y-2 overflow-y-auto">
          {serviceRoads.map((road) => (
            <li
              key={road.id}
              className="flex items-center justify-between rounded-lg bg-green-50 p-2 text-sm dark:bg-green-900/20"
            >
              <span className="font-medium text-slate-800 dark:text-slate-200">{road.name}</span>
              <Badge variant={road.accessType === 'legal' ? 'success' : road.accessType === 'emergency' ? 'warning' : 'danger'}>
                {road.accessType}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

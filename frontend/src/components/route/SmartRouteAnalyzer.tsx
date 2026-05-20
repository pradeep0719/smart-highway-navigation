import { Brain, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore';
import { useRouteGeneration } from '../../hooks/useRouteGeneration';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';

/** AI-powered route analysis panel */
export default function SmartRouteAnalyzer() {
  const { activeRoute, analysis, isAnalyzing } = useNavigationStore();
  const { analyzeRoute } = useRouteGeneration();

  if (!activeRoute) return null;

  const handleAnalyze = () => {
    if (activeRoute.id) analyzeRoute(activeRoute.id);
  };

  return (
    <div className="glass-panel space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Brain className="h-5 w-5 text-highway-600" />
          Smart route analyzer
        </h3>
        <Button size="sm" onClick={handleAnalyze} isLoading={isAnalyzing} disabled={isAnalyzing}>
          Analyze
        </Button>
      </div>

      {isAnalyzing && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {analysis && !isAnalyzing && (
        <div className="animate-slide-up space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-highway-500"
                  strokeWidth="3"
                  strokeDasharray={`${analysis.score} 100`}
                />
              </svg>
              <span className="absolute text-xl font-bold text-highway-600">{analysis.score}</span>
            </div>
            <div className="space-y-1">
              <Badge variant={analysis.safetyRating === 'high' ? 'success' : analysis.safetyRating === 'medium' ? 'warning' : 'danger'}>
                Safety: {analysis.safetyRating}
              </Badge>
              <Badge variant="info">Traffic: {analysis.trafficLevel}</Badge>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Highway coverage: {analysis.highwayCoverage}%
              </p>
            </div>
          </div>

          {analysis.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Warnings
              </h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                {analysis.warnings.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="flex items-center gap-1 text-sm font-medium text-highway-700 dark:text-highway-400">
                <Lightbulb className="h-4 w-4" /> Recommendations
              </h4>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              <BarChart3 className="mx-auto h-4 w-4 text-amber-500" />
              <p className="mt-1 font-medium">{analysis.joiningRoadsCount}</p>
              <p className="text-xs text-slate-500">Joining roads</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800">
              <BarChart3 className="mx-auto h-4 w-4 text-green-500" />
              <p className="mt-1 font-medium">{analysis.serviceRoadsCount}</p>
              <p className="text-xs text-slate-500">Service roads</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

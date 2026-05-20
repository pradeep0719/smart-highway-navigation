import { Users, Route, Activity, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import type { AdminStats } from '../../types';

interface StatsCardsProps {
  stats: AdminStats | null;
  isLoading?: boolean;
}

/** Admin dashboard statistics cards */
export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    { label: 'Total users', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-highway-600' },
    { label: 'Total routes', value: stats?.totalRoutes ?? '—', icon: Route, color: 'text-green-600' },
    { label: 'Active sessions', value: stats?.activeSessions ?? '—', icon: Activity, color: 'text-amber-600' },
    { label: 'Routes today', value: stats?.routesToday ?? '—', icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className={isLoading ? 'animate-pulse opacity-60' : ''}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            </div>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
}

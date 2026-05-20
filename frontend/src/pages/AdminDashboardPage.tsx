import { useCallback, useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import StatsCards from '../components/admin/StatsCards';
import UsersTable from '../components/admin/UsersTable';
import Spinner from '../components/ui/Spinner';
import { adminService } from '../services/adminService';
import type { AdminStats, User } from '../types';

/** Admin dashboard for user and route management */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch {
      // Mock data when backend unavailable
      setStats({
        totalUsers: 0,
        totalRoutes: 0,
        activeSessions: 0,
        routesToday: 0,
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-highway-600" />
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage users and monitor platform activity</p>
        </div>
      </div>

      {isLoading && !stats ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <>
          <StatsCards stats={stats} isLoading={isLoading} />
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Users</h2>
            <UsersTable users={users} onRefresh={loadData} />
          </section>
        </>
      )}
    </div>
  );
}

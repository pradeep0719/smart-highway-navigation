import { Shield, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { User } from '../../types';

interface UsersTableProps {
  users: User[];
  onRefresh: () => void;
}

/** Admin user management table */
export default function UsersTable({ users, onRefresh }: UsersTableProps) {
  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminService.updateUserRole(userId, newRole as 'user' | 'admin');
      toast.success(`Role updated to ${newRole}`);
      onRefresh();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted');
      onRefresh();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-200 dark:border-slate-700">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{user.email}</td>
              <td className="px-4 py-3">
                <Badge variant={user.role === 'admin' ? 'info' : 'default'}>{user.role}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleRoleChange(user.id, user.role)}>
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { User, Mail, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/** User profile page */
export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <Card title="Your profile">
        <div className="space-y-4">
          <ProfileRow icon={User} label="Name" value={user.name} />
          <ProfileRow icon={Mail} label="Email" value={user.email} />
          <ProfileRow
            icon={Shield}
            label="Role"
            value={<Badge variant={user.role === 'admin' ? 'info' : 'default'}>{user.role}</Badge>}
          />
        </div>
      </Card>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 dark:border-slate-800">
      <Icon className="h-5 w-5 text-slate-400" />
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <div className="mt-0.5 font-medium text-slate-900 dark:text-white">{value}</div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import {
  Map,
  Route,
  Brain,
  Volume2,
  Shield,
  GitBranch,
  ArrowRight,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: Map,
    title: 'Live map',
    description: 'Real-time OpenStreetMap and Google Maps integration with highway-focused views.',
  },
  {
    icon: Route,
    title: 'Smart routing',
    description: 'AI-optimized routes with service road highlighting and joining road detection.',
  },
  {
    icon: GitBranch,
    title: 'Alternate access',
    description: 'Legal alternate routes when primary highway access is restricted.',
  },
  {
    icon: Brain,
    title: 'Route analyzer',
    description: 'Safety scores, traffic insights, and actionable recommendations.',
  },
  {
    icon: Volume2,
    title: 'Voice navigation',
    description: 'Hands-free turn-by-turn guidance using Web Speech API.',
  },
  {
    icon: Shield,
    title: 'Secure & admin',
    description: 'JWT authentication with role-based admin dashboard.',
  },
];

/** Landing page */
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-highway-900 via-highway-800 to-slate-900 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggIGQ9Ik0zNiAzNGg2djZoLTZ6bTAtMzBoNnY2aC02em0tMzAgMGg2djZoLTZ6bTAgMzBoNnY2aC02em0zMCAzMGg2djZoLTZ6bTAgMzBoNnY2aC02em0zMCAzMGg2djZoLTZ6eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            AI-Powered Smart Highway Navigation
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-highway-100">
            Navigate national highways with confidence. Detect joining roads, highlight service lanes,
            and get alternate legal access routes — all in one intelligent platform.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to={isAuthenticated ? '/navigate' : '/register'}>
              <Button size="lg" className="bg-white text-highway-800 hover:bg-highway-50">
                {isAuthenticated ? 'Start navigating' : 'Get started free'}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold text-slate-900 dark:text-white">
          Everything you need for highway travel
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Built for drivers, fleet operators, and highway authorities.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="mb-4 inline-flex rounded-lg bg-highway-50 p-3 dark:bg-highway-950">
                <Icon className="h-6 w-6 text-highway-600" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

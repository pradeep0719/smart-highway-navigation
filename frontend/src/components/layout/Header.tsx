import { Link, NavLink } from 'react-router-dom';
import { Map, Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import { APP_NAME } from '../../utils/constants';
import { cn } from '../../utils/cn';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/navigate', label: 'Navigate', auth: true },
  { to: '/admin', label: 'Admin', auth: true, admin: true },
];

/** Application header with responsive navigation */
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredLinks = navLinks.filter((link) => {
    if (link.auth && !isAuthenticated) return false;
    if (link.admin && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-highway-700 dark:text-highway-400">
          <Map className="h-7 w-7" />
          <span className="hidden sm:inline">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-highway-50 text-highway-700 dark:bg-highway-950 dark:text-highway-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:flex"
              >
                <User className="h-4 w-4" />
                {user?.name}
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 sm:block">
                  <Shield className="h-5 w-5" />
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 sm:block"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="hidden gap-2 sm:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
          <button
            type="button"
            className="rounded-lg p-2 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {link.label}
            </NavLink>
          ))}
          {!isAuthenticated && (
            <div className="mt-2 flex gap-2">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

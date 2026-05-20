import { Map } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

/** Application footer */
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Map className="h-5 w-5 text-highway-600" />
          <span>{APP_NAME}</span>
        </div>
        <p className="text-center text-xs text-slate-500">
          AI-powered highway navigation · Google Maps & OpenStreetMap
        </p>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} Smart Highway Nav</p>
      </div>
    </footer>
  );
}

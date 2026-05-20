import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import Button from '../components/ui/Button';

/** 404 Not Found page */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <MapPinOff className="h-16 w-16 text-slate-400" />
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        The road you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}

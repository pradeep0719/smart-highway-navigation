import { cn } from '../../utils/cn';

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-8 w-8 animate-spin rounded-full border-4 border-highway-200 border-t-highway-600',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

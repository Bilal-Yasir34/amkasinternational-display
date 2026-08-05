import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useSeo } from '@/lib/seo';

export default function NotFoundPage() {
  useSeo({ title: 'Page Not Found — AMKAS INTERNATIONAL', description: 'The page you are looking for does not exist.' });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-beige-50 px-6 text-center">
      <p className="font-serif text-7xl font-medium text-ink-900 sm:text-8xl">404</p>
      <p className="mt-4 max-w-md text-ink-600">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <Link to="/" className="btn-primary mt-8">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}

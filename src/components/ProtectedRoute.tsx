import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

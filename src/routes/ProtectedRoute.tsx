import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { paths } from './paths';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

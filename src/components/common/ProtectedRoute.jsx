import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../ui/Loading';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <Loading fullScreen text="Authenticating..." />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;

// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children, allowedRole }) => {
  const [authUser] = useAuth();

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && authUser.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

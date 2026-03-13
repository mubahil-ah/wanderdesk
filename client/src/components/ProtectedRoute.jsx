import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not logged in
  if (!currentUser || !userProfile) {
    return <Navigate to="/login" replace />;
  }

  // Logged in, but route restricted by role
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    toast.error('Access Denied: You do not have permission to view this page.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

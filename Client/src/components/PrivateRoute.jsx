import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation();
  const { currentUser, token } = useSelector((state) => state.user);
  const publicPaths = ['/', '/sign-in', '/sign-up'];

  // Check if the current path is one of the public paths
  if (publicPaths.includes(location.pathname)) {
    return <Outlet />; // Render children without any checks if it's a public path
  }

  if (!token) {
    // If no token and trying to access a protected route, redirect to sign-in
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // If user does not have the required role, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and has required role, or accessing public paths, render the child components
  return <Outlet />;
};

// Define prop types for the allowedRoles prop
PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
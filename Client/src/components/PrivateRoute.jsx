import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser, token } = useSelector((state) => state.user);

  if (!token) {
    // If no token, redirect to sign-in page
    return <Navigate to="/sign-in" replace />;
  }

  if (!allowedRoles.includes(currentUser?.role)) {
    // If user does not have the required role, redirect to home page
    return <Navigate to="/" replace />;
  }

  // If authenticated and has required role, render the child components
  return <Outlet />;
};

// Define prop types for the allowedRoles prop
PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;

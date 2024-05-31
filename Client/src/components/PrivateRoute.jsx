import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ allowedRoles, redirectPath = '/sign-in' }) => {
  const location = useLocation();
  const { currentUser, token } = useSelector((state) => state.user);

  if (!token || !currentUser) {
    // Redirect unauthorized users to sign-in and pass the current location in state
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectPath: PropTypes.string,
};

export default PrivateRoute;

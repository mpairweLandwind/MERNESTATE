import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, allowedRoles, redirectPath = '/sign-in' }) => {
  const location = useLocation();
  const { currentUser, token } = useSelector(state => state.user);

  if (!token || !currentUser) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {Component ? <Component /> : null}
      <Outlet />
    </>
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  redirectPath: PropTypes.string,
};

export default PrivateRoute;

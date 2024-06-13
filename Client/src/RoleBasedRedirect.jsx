import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentUser, getToken } from './redux/user/useSelectors';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);

  useEffect(() => {
    if (currentUser && token) {
      let path;
      switch (currentUser.role) {
        case 'admin':
          path = '/admin-dashboard';
          break;
        case 'user':
          path = '/user-dashboard';
          break;
        case 'landlord':
          path = '/landlord/dashboard';
          break;
        default:
          path = '/';
      }
      navigate(path);
    }
  }, [currentUser, token, navigate]);

  return null;
};

export default RoleBasedRedirect;

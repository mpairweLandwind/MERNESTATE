import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect } from 'react';
import UserDetailContext from '../context/UserDetailContext';
import { toast } from "react-toastify";

const useAuthCheck = () => {
  const { isAuthenticated, user } = useAuth0();
  const { setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Assuming `user.email` is available in the Auth0 `user` object
      setUserDetails({ email: user.email, name: user.name });
    }
  }, [isAuthenticated, user, setUserDetails]);

  const validateLogin = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in", { position: "bottom-right" });
      return false;
    }
    return true;
  };

  return { validateLogin, isAuthenticated };
};

export default useAuthCheck;

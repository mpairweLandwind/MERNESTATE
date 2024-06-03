import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCurrentUser } from '../redux/user/userSlice';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchData = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetchData(`api/auth/signout`, { method: 'GET' });
        dispatch(clearCurrentUser()); // Update user to null after logout
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    };

    handleLogout();
  }, [dispatch, navigate]);

  return null;
};

export default Logout;

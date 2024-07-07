
import { useSelector } from 'react-redux';

export const useAuthToken = () => {
  const token = useSelector(state => state.user.token);
  return token;
};

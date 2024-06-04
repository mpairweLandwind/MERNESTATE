import { useNavigate, Link } from 'react-router-dom';
//useLocation ,
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { useState } from 'react';
import '../Pages/signIn.scss';
import user_password from "../assets/password.png";
import user_email from "../assets/email.png";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  // const location = useLocation();
  const dispatch = useDispatch();

  // const from = location.state?.from?.pathname || '/';


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseText = await res.text();
      if (res.ok) {
        const data = JSON.parse(responseText);
        console.log(data);

        if (!data.success || !data.token) {
          dispatch(signInFailure(data.message || 'Authentication failed'));
          return;
        }
         
        // dispatch(signInSuccess({ user: data.user, token: data.token }));
        // navigate(from, { replace: true });
        // Dispatch success action with the user and token
        dispatch(signInSuccess({ user: data.user, token: data.token }));

        // Persist token in localStorage if needed
        localStorage.setItem('token', data.token);

        // Redirect based on the role property in the data object
        const role = data.user.role;
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'landlord') {
          navigate('/landlord');
        } else if (role === 'user') {
          navigate('/user-dashboard');
        } else {
          navigate('/'); // Default redirection if role is undefined or not handled
        }
      } else {
        const errorData = JSON.parse(responseText);
        dispatch(signInFailure(errorData.message || 'Authentication failed'));
      }
    } catch (error) {
      dispatch(signInFailure('Failed to connect to the server'));
    }
  };

  return (
    <div className='signin-container'>
      <div className="title">
        <h1 className='signin-title'>Sign In</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signin-form' action='#' method='POST'>
        <div className="signin-input">
          <img src={user_email} alt="" />
          <input
            type='email'
            placeholder='Email'
            id='email'
            onChange={handleChange}
          />
        </div>
        <div className="signin-input">
          <img src={user_password} alt="" />
          <input
            type='password'
            placeholder='Password'
            id='password'
            onChange={handleChange}
          />
        </div>
        <div className="buttons">
          <button
            disabled={loading}
            className='signin-button'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <button
            disabled={loading}
            className="signin-button"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </div>
        <OAuth />
      </form>
      <div className='signin-footer'>
        <p>Forgot your password?</p>
        <Link to={'/sign-up'}>
          <span className='signup-link'>Reset Password</span>
        </Link>
      </div>
      {error && <p className='signin-error'>{error}</p>}
    </div>
  );
}

import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { useState } from 'react';
import user_password from "../assets/password.png";
import user_email from "../assets/email.png";
import './signIn.scss';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        if (!data.success || !data.token) {
          dispatch(signInFailure(data.message || 'Authentication failed'));
          return;
        }

        dispatch(signInSuccess({ user: data.user, token: data.token }));
        localStorage.setItem('token', data.token);

        switch (data.user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'landlord':
            navigate('/landlord/dashboard');
            break;
          case 'user':
            navigate('/user-dashboard');
            break;
          default:
            navigate('/');
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
            type='submit'
            disabled={loading}
            className='signin-button'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <Link to='/sign-up'>
            <button className="signin-button">
              Sign Up
            </button>
          </Link>
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

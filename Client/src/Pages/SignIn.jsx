import { useNavigate, Link } from 'react-router-dom';
//useLocation ,
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { useState } from 'react';

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
    <div className="flex bg-slate-700 min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-14 rounded-full w-15"
          src="./logo.jpeg"
          alt="GestImpact"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div className='py-6'>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={handleChange}
              />
            </div>
            <div className='py-4'>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </div>

          <OAuth />
        </form>
      </div>
      <div className='flex gap-2 mt-5'>
        <p>Don`t have an account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}

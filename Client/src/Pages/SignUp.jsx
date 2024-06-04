import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import '../Pages/signUp.scss';
import user_icon from "../assets/person.png";
import user_password from "../assets/password.png";
import user_email from "../assets/email.png";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.id === 'role') {
      setFormData({
        ...formData,
        role: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='signup-container'>
      <div className="title">
        <h1 className='signup-title'>Sign Up</h1>
        <div className="underline"></div>
      </div>
      <form onSubmit={handleSubmit} className='signup-form'>
        <div className="signup-input">
          <img src={user_icon} alt="" />
          <input
            type='text'
            placeholder='username'
            id='username'
            onChange={handleChange}
          />
        </div>
        <div className="signup-input">
          <img src={user_email} alt="" />
          <input
            type='email'
            placeholder='email'
            id='email'
            onChange={handleChange}
          />
        </div>
        <select
          className='signup-select'
          id='role'
          onChange={handleChange}
          required
        >
          <option value=''>Select Role</option>
          <option value='admin'>Admin</option>
          <option value='landlord'>Landlord</option>
          <option value='user'>User</option>
        </select>
        <div className="signup-input">
          <img src={user_password} alt="" />
          <input
            type='password'
            placeholder='password'
            id='password'
            onChange={handleChange}
          />
        </div>
        <div className="buttons">
          <button
            disabled={loading}
            className='signup-button'
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </div>
        <OAuth />
      </form>
      <div className='account-info'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='signin-link'>Sign in</span>
        </Link>
      </div>
      {error && <p className='signup-error'>{error}</p>}
    </div>
  );
}

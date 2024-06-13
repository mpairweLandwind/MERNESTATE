import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaBell, FaGlobe } from 'react-icons/fa';
import { useNotificationStore } from '../../lib/notificationStore';
import './header.scss';
import { clearCurrentUser } from '../../redux/user/userSlice';
import { getToken, getCurrentUser } from '../../redux/user/useSelectors';

export default function Header() {
  const currentUser = useSelector(getCurrentUser);
  const token = useSelector(getToken);
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  
  const getProfileLink = useCallback(() => {
    if (!currentUser) return '/sign-in';
    switch (currentUser.role) {
      case 'admin': return '/admin-dashboard';
      case 'user': return '/user-dashboard';
      case 'landlord': return '/landlord/dashboard';
      default: return '/';
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      console.log("Fetching notifications for user:", currentUser.username);
      fetch(token); // Pass the token to the fetch function
    }
  }, [currentUser, token, fetch]);

  useEffect(() => {
    if (currentUser && token) {
      const path = getProfileLink();
      navigate(path);
    }
  }, [currentUser, token, navigate, getProfileLink]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.matches('.language-button')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    dispatch(clearCurrentUser());
    navigate('/');
  };

  return (
    <header className='header'>
      <div className="content">
        <div className="left">
          <div className="flex items-center space-x-4">
            <Link to='/' className="logo-container">
              <img src="./logo.jpeg" alt="Logo" width={100} />
            </Link>
            <span className='text-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg shadow-lg'>
              GestImpact
            </span>
          </div>
          <Link to='/' className='nav-item'>Home</Link>
          <Link to='/about' className='nav-item'>About</Link>
          <form onSubmit={handleSubmit} className='search-form'>
            <input
              type='text'
              placeholder={t('search')}
              className='search-input'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className='search-button'>
              <FaSearch className='search-icon' />
            </button>
          </form>
        </div>

        <div className="right">
          <div className='language-selector pr-8'>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className='language-button'>
              <FaGlobe size={20} className='globe-icon' />
            </button>
            {dropdownOpen && (
              <ul className='language-dropdown'>
                <li onClick={() => handleLanguageChange('en')}>English</li>
                <li onClick={() => handleLanguageChange('fr')}>Français</li>
              </ul>
            )}
          </div>
          {currentUser ? (
            <div className="user">
              <Link to={getProfileLink()}>
                <img
                  className="rounded-full h-8 w-8 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </Link>
              <span>{currentUser.username}</span>
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
              <Link to={getProfileLink()} className="profile">
              </Link>
              <div className="notification">
                {number > 0 && <div className="number">{number}</div>}
                <FaBell className="icon" />
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/sign-in">Sign in</Link>
              <Link to="/sign-up" className="register">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

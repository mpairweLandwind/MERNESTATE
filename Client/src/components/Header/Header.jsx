import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaBell, FaGlobe } from 'react-icons/fa';
import { useNotificationStore } from '../../lib/notificationStore';
import './header.scss';
import { clearCurrentUser } from '../../redux/user/userSlice';
import { startTransition } from 'react';

export default function Header() {
  const { currentUser, token } = useSelector((state) => state.user);
  const { i18n, t } = useTranslation();  
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const navigate = useNavigate();
  
  const fetch = useNotificationStore((state) => state.fetch);
  const numberObj = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) {
      console.log("Fetching notifications for user:", currentUser.username);
      fetch(token);
    }
  }, [currentUser, token, fetch]);

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
    const handleLanguageChanged = (lang) => {
      setCurrentLanguage(lang);
    };
    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  useEffect(() => {
    if (currentUser && token) {
      const path = getProfileLink();
      navigate(path);
    }
  }, [currentUser, token, navigate, getProfileLink]);

  const handleLanguageChange = (lang) => {
    startTransition(() => {
      i18n.changeLanguage(lang);
      setCurrentLanguage(lang); // Update the current language state
      setDropdownOpen(false);
    });
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

  // Extract the count from the number object
  const count = numberObj?.count || 0;

  return (
    <header className='header'>
      <div className="content">
        <div className="left">
          <div className="flex items-center space-x-4 ">
            <Link to='/' className="logo-container">
              <img src="/logo.jpeg" alt="Logo" width={100} />
            </Link>
            <span className='text-l font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-lg shadow-lg'>
              GestImpact
            </span>
          </div>
          <Link to='/' className='nav-item'>{t('home')}</Link>
          <Link to='/about' className='nav-item'>{t('about')}</Link>
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
              <span className='selected-language'></span>
              {currentLanguage.toUpperCase()}
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
                {t('log_out')}
              </button>
              <div className="notification">
                {count > 0 && <div className="number">{count}</div>}
                <FaBell className="icon" />
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/sign-in">{t('sign_in')}</Link>
              <Link to="/sign-up" className="register">{t('sign_up')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

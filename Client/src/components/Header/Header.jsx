import { useEffect, useState } from 'react';
import { FaSearch, FaGlobe } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './header.scss';

export default function Header() {
  const { i18n } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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

  const { t } = useTranslation();

  const getProfileLink = () => {
    if (!currentUser) return '/sign-in';
    switch (currentUser.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'user':
        return '/user-dashboard';
      case 'landlord':
        return '/landlord';
      default:
        return '/';
    }
  };

  return (
    <header className='header'>
      <div className="content">
        <div className="left">
          <Link to='/' className="logo-container">           
              <img src="./logo.jpeg" alt="" width={100} />
              <span>GestImpact</span>           
          </Link>
          <Link to='/'className='nav-item'>Home</Link>
          <Link to='/about'className='nav-item'>About</Link>
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
          <div className='user'>
            {currentUser ? (
              <>
                <Link to={getProfileLink()}>
                  <img className='rounded-full h-12 w-12 object-cover' src={currentUser.avatar} alt='profile' />
                </Link>
                <span>{currentUser?.username}</span>
                <Link to={getProfileLink()} className='profile'>
                  <div className="notification">3</div>
                  <span>Profile</span>
                </Link>
              </>
            ) : (
                <>
                  <a href='/'>Sign in</a>
                  <a href="/" className='register'>Sign up</a>
                </>
            )}
          </div>
          <a className='language-selector'>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className='language-button'>
              <FaGlobe size={20} className='globe-icon' />
            </button>
            {dropdownOpen && (
              <ul className='language-dropdown'>
                <li onClick={() => handleLanguageChange('en')}>English</li>
                <li onClick={() => handleLanguageChange('fr')}>Français</li>
              </ul>
            )}
          </a>
        </div>
      </div>
    </header>
  );
}

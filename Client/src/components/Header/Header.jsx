import { useEffect, useState } from 'react';
import { FaSearch, FaGlobe, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import '../Header/header.scss';

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

  return (
    <header className='header'>
      <div className="content">
        <div className="left">
          <Link to='/' className="logo-container">
            <a href='/' className='logo'>
              <img src="./logo.jpeg" alt="" width={100} />
              <span>GestImpact</span>
            </a>
          </Link>
          <Link to='/'><a className='nav-item'>Home</a></Link>
          <Link to='/about'><a className='nav-item'>About</a></Link>
          <form onSubmit={handleSubmit} className='search-form'>
            <input
              type='text'
              placeholder={t('search')}
              className='search-input'
              value={searchTerm}
              onChange={(e) => setSearchWizard(e.target.value)}
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
                <Link><img className='rounded-full h-12 w-12 object-cover' src={currentUser.avatar} alt='profile' /></Link>
                <span>John Doe</span>
                <Link to="/profile" className='profile'>
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
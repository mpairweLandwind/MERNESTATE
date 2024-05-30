import { useEffect, useState } from 'react';
import { FaSearch, FaGlobe } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
    <header className='bg-slate-700 shadow-md relative z-10'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/' className="flex items-center">
          <h1 className='font-bold text-sm sm:text-xl flex items-center'>          
              <div className="bg-slate w-16 h-16 flex items-center justify-center rounded-full">
                <img src="./logo.jpeg" alt="" width={80} className="rounded-full" />
              </div>
              <span className="ml-2">GestImpact</span>
           
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder={t('search')}
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-white' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <li className='relative'>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className='flex items-center text-white hover:underline language-button'>
              <FaGlobe size={20} />
            </button>
            {dropdownOpen && (
              <ul className='absolute right-0 bg-white border mt-2 rounded-md shadow-lg w-20 z-20'>
                <li className='cursor-pointer hover:bg-white p-2 text-center' onClick={() => handleLanguageChange('en')}>
                  English
                </li>
                <li className='cursor-pointer hover:bg-white p-2 text-center' onClick={() => handleLanguageChange('fr')}>
                  Français
                </li>
              </ul>
            )}
          </li>
          <Link to='/'>
            <li className='hidden sm:inline text-white hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-white hover:underline'>
              About
            </li>
          </Link>
          <Link to='/sign-in'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-white hover:underline'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { setSearchQuery } from '../../store/recipeSlice';
import styles from './Header.module.scss';
//import logoSvg from '../../assets/logo.svg';
import searchIcon from '../../assets/search.svg';
import userIcon from '../../assets/user.svg';
import heartIcon from '../../assets/heart.svg';
import plusIcon from '../../assets/plus.svg';
//import newLogoSVG from './../../assets/newlogo.svg'
import logoSVG from './../../assets/pot_no_bg (4).svg'
import languageIcon from '../../assets/language.svg';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  // Language state for future localization
  const [lang, setLang] = useState<'he' | 'en'>('he');

  const handleLogout = async () => {
    await dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));
    navigate('/recipes');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Left - Logo */}
        <Link to="/" className={styles.logo} onClick={handleLogoClick}>
          <img src={logoSVG} alt="Grandma's Recipes" />
          <span className={styles.logoName}>  Grandma's<br/>Recipes</span>

        </Link>

        {/* Center - Search Bar */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <img src={searchIcon} alt="Search" />
          </button>
        </form>

        {/* Right - Action Buttons */}
        <div className={styles.actions}>
          {/* User Menu */}
          <div className={styles.userMenuWrapper}>
            <button
              className={styles.actionButton}
              onClick={toggleUserMenu}
              aria-label="User menu"
            >
              <img src={userIcon} alt="User" />
            </button>

            {showUserMenu && (
              <div className={styles.userMenu}>
                {user ? (
                  <>
                    <div className={styles.userInfo}>Hello, {user.fullName}</div>
                    <button onClick={handleLogout} className={styles.menuItem}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={styles.menuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={styles.menuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Favorites - Heart */}
          <Link to="/favorites" className={styles.actionButton} aria-label="Favorites">
            <img src={heartIcon} alt="Favorites" />
          </Link>

          {/* Groups - only for authenticated users */}
          {user && (
            <Link to="/groups" className={styles.actionButton} aria-label="Groups" title="קבוצות">
              <span className={styles.groupIcon}>👥</span>
            </Link>
          )}

          {/* Language Toggle */}
          <button
            className={styles.actionButton}
            onClick={() => setLang(prev => prev === 'he' ? 'en' : 'he')}
            aria-label="Toggle language"
            title={lang === 'he' ? 'Switch to English' : 'Switch to Hebrew'}
          >
            <img src={languageIcon} alt="Language" />
          </button>

          {/* Admin - Plus (only for admin) */}
          {user?.role === 'admin' && (
            <Link to="/admin" className={styles.actionButton} aria-label="Add recipe">
              <img src={plusIcon} alt="Add recipe" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

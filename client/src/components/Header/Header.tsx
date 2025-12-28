import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { setSearchQuery } from '../../store/recipeSlice';
import styles from './Header.module.scss';
import searchIcon from '../../assets/search.svg';
import userIcon from '../../assets/user.svg';
import heartIcon from '../../assets/heart.svg';
import plusIcon from '../../assets/plus.svg';
import logoSVG from './../../assets/pot_no_bg (4).svg';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo - Right side in RTL */}
        <Link to="/" className={styles.logo} onClick={handleLogoClick}>
          <img src={logoSVG} alt="המתכונים של סבתא" />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>המתכונים של סבתא</span>
            <span className={styles.logoSubtitle}>טעמים של בית</span>
          </div>
        </Link>

        {/* Search Bar - Center */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="חיפוש מתכונים..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} aria-label="חיפוש">
            <img src={searchIcon} alt="" />
          </button>
        </form>

        {/* Action Buttons - Left side in RTL */}
        <div className={styles.actions}>
          {/* Admin - Plus (only for admin) */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={styles.actionButton}
              aria-label="הוספת מתכון"
              title="הוספת מתכון"
            >
              <img src={plusIcon} alt="" />
            </Link>
          )}

          {/* Favorites - Heart */}
          <Link
            to="/favorites"
            className={styles.actionButton}
            aria-label="מועדפים"
            title="מועדפים"
          >
            <img src={heartIcon} alt="" />
          </Link>

          {/* User Menu */}
          <div className={styles.userMenuWrapper}>
            <button
              className={styles.actionButton}
              onClick={toggleUserMenu}
              aria-label="תפריט משתמש"
              aria-expanded={showUserMenu}
              title={user ? user.fullName : 'התחברות'}
            >
              <img src={userIcon} alt="" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className={styles.menuBackdrop}
                  onClick={closeUserMenu}
                  aria-hidden="true"
                />
                <div className={styles.userMenu} role="menu">
                  {user ? (
                    <>
                      <div className={styles.userInfo}>
                        <span className={styles.greeting}>שלום,</span>
                        <span className={styles.userName}>{user.fullName}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={styles.menuItem}
                        role="menuitem"
                      >
                        התנתקות
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className={styles.menuItem}
                        onClick={closeUserMenu}
                        role="menuitem"
                      >
                        התחברות
                      </Link>
                      <Link
                        to="/register"
                        className={styles.menuItem}
                        onClick={closeUserMenu}
                        role="menuitem"
                      >
                        הרשמה
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Groups - only for authenticated users */}
          {user && (
            <Link to="/groups" className={styles.actionButton} aria-label="Groups" title="קבוצות">
              <span className={styles.groupIcon}>👥</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

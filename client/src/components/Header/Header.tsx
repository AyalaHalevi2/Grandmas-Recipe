import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { setSearchQuery } from '../../store/recipeSlice';
import styles from './Header.module.scss';
import searchIcon from '../../assets/search.svg';
import userIcon from '../../assets/user.svg';
import heartIcon from '../../assets/heart.svg';
import plusIcon from '../../assets/plus.svg';
import groupsIcon from '../../assets/groups.svg';
import bookHeartIcon from '../../assets/book-heart.svg';
import logoSVG from './../../assets/pot_no_bg (4).svg';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async (): Promise<void> => {
    await dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    dispatch(setSearchQuery(searchValue));
    navigate('/recipes');
  };

  const toggleUserMenu = (): void => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogoClick = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeUserMenu = useCallback((): void => {
    setShowUserMenu(false);
    userMenuButtonRef.current?.focus();
  }, []);

  // Keyboard navigation for user menu
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Escape') {
      closeUserMenu();
    }

    // Arrow key navigation within menu
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const menuItems = userMenuRef.current?.querySelectorAll<HTMLElement>(
        'button[role="menuitem"], a[role="menuitem"]'
      );
      if (!menuItems?.length) return;

      const currentIndex = Array.from(menuItems).findIndex(
        item => item === document.activeElement
      );

      let nextIndex: number;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
      } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
      }

      menuItems[nextIndex].focus();
    }
  }, [closeUserMenu]);

  // Focus first menu item when menu opens
  useEffect(() => {
    if (showUserMenu && userMenuRef.current) {
      const firstMenuItem = userMenuRef.current.querySelector<HTMLElement>(
        'button[role="menuitem"], a[role="menuitem"]'
      );
      firstMenuItem?.focus();
    }
  }, [showUserMenu]);

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        {/* Logo - Right side in RTL */}
        <Link to="/" className={styles.logo} onClick={handleLogoClick} aria-label="המתכונים של סבתא - חזרה לדף הבית">
          <img src={logoSVG} alt="" aria-hidden="true" />
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>המתכונים של סבתא</span>
            <span className={styles.logoSubtitle}>טעמים של בית</span>
          </div>
        </Link>

        {/* Search Bar - Center */}
        <form
          className={styles.searchBar}
          onSubmit={handleSearch}
          role="search"
          aria-label="חיפוש מתכונים באתר"
        >
          <label htmlFor="header-search" className="visually-hidden">
            חיפוש מתכונים
          </label>
          <input
            id="header-search"
            type="search"
            placeholder="חיפוש מתכונים..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.searchInput}
            autoComplete="off"
          />
          <button type="submit" className={styles.searchButton} aria-label="בצע חיפוש">
            <img src={searchIcon} alt="" aria-hidden="true" />
          </button>
        </form>

        {/* Navigation Actions - Left side in RTL */}
        <nav className={styles.actions} aria-label="ניווט מהיר">
          {/* Admin - Plus (only for admin) */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={styles.actionButton}
              aria-label="הוספת מתכון חדש"
              title="הוספת מתכון"
            >
              <img src={plusIcon} alt="" aria-hidden="true" />
            </Link>
          )}

          {/* Favorites - Heart */}
          <Link
            to="/favorites"
            className={styles.actionButton}
            aria-label="צפייה במתכונים מועדפים"
            title="מועדפים"
          >
            <img src={heartIcon} alt="" aria-hidden="true" />
          </Link>

          {/* User Menu */}
          <div className={styles.userMenuWrapper}>
            <button
              ref={userMenuButtonRef}
              className={styles.actionButton}
              onClick={toggleUserMenu}
              aria-label={user ? `תפריט משתמש עבור ${user.fullName}` : 'תפריט התחברות'}
              aria-expanded={showUserMenu}
              aria-haspopup="menu"
              aria-controls="user-menu"
              title={user ? user.fullName : 'התחברות'}
            >
              <img src={userIcon} alt="" aria-hidden="true" />
            </button>

            {showUserMenu && (
              <>
                <div
                  className={styles.menuBackdrop}
                  onClick={closeUserMenu}
                  aria-hidden="true"
                />
                <div
                  ref={userMenuRef}
                  id="user-menu"
                  className={styles.userMenu}
                  role="menu"
                  aria-label="תפריט משתמש"
                  onKeyDown={handleMenuKeyDown}
                >
                  {user ? (
                    <>
                      <div className={styles.userInfo} role="presentation">
                        <span className={styles.greeting}>שלום,</span>
                        <span className={styles.userName}>{user.fullName}</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className={styles.menuItem}
                        role="menuitem"
                        tabIndex={0}
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
                        tabIndex={0}
                      >
                        התחברות
                      </Link>
                      <Link
                        to="/register"
                        className={styles.menuItem}
                        onClick={closeUserMenu}
                        role="menuitem"
                        tabIndex={0}
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
            <Link
              to="/groups"
              className={styles.actionButton}
              aria-label="צפייה בקבוצות"
              title="קבוצות"
            >
              <img src={groupsIcon} alt="" aria-hidden="true" />
            </Link>
          )}

          {/* About - Grandma's Story (far left in RTL) */}
          <Link
            to="/about"
            className={styles.actionButton}
            aria-label="הסיפור של סבתא"
            title="הסיפור של סבתא"
          >
            <img src={bookHeartIcon} alt="" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

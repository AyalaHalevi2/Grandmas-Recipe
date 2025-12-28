import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import potLogoSVG from './../../assets/pot_no_bg (4).svg';

const Footer = () => {
  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="תחתית האתר">
      <div className={styles.container}>
        {/* Brand Section */}
        <section className={styles.section} aria-labelledby="footer-brand">
          <h3 id="footer-brand" className={styles.title}>המתכונים של סבתא</h3>
          <p className={styles.description}>
            טעמים מהבית, עשויים באהבה.
          </p>
          <img src={potLogoSVG} alt="" aria-hidden="true" />
        </section>

        {/* Quick Links Section */}
        <section className={styles.section} aria-labelledby="footer-quicklinks">
          <h4 id="footer-quicklinks" className={styles.subtitle}>קישורים מהירים</h4>
          <nav className={styles.links} aria-label="קישורים מהירים">
            <Link to="/" onClick={scrollToTop}>דף הבית</Link>
            <Link to="/recipes" onClick={scrollToTop}>מתכונים</Link>
            <Link to="/favorites" onClick={scrollToTop}>מועדפים</Link>
          </nav>
        </section>

        {/* Categories Section */}
        <section className={styles.section} aria-labelledby="footer-categories">
          <h4 id="footer-categories" className={styles.subtitle}>קטגוריות</h4>
          <nav className={styles.links} aria-label="קטגוריות מתכונים">
            <Link to="/recipes?category=Appetizers" onClick={scrollToTop}>מנות ראשונות</Link>
            <Link to="/recipes?category=Main%20Dishes" onClick={scrollToTop}>מנות עיקריות</Link>
            <Link to="/recipes?category=Desserts" onClick={scrollToTop}>קינוחים</Link>
          </nav>
        </section>

        {/* Account Section */}
        <section className={styles.section} aria-labelledby="footer-account">
          <h4 id="footer-account" className={styles.subtitle}>חשבון</h4>
          <nav className={styles.links} aria-label="ניהול חשבון">
            <Link to="/login" onClick={scrollToTop}>התחברות</Link>
            <Link to="/register" onClick={scrollToTop}>הרשמה</Link>
          </nav>
        </section>
      </div>

      {/* Copyright */}
      <div className={styles.bottom}>
        <p>
          <small>&copy; {currentYear} המתכונים של סבתא. כל הזכויות שמורות.</small>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

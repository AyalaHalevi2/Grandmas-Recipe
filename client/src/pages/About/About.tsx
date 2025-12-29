import styles from './About.module.scss';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>הסיפור של סבתא</h1>
          <p className={styles.heroSubtitle}>מסע של טעמים, זיכרונות ואהבה</p>
        </div>
      </section>

      {/* Main Story Content */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          {/* Opening Quote */}
          <blockquote className={styles.openingQuote}>
            <p>"הבישול הוא אהבה שאפשר לטעום"</p>
            <cite>- סבתא רינה</cite>
          </blockquote>

          {/* Story Cards */}
          <div className={styles.storyContent}>
            {/* The Beginning */}
            <article className={styles.storyCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>ההתחלה</h2>
              <p className={styles.cardText}>
                סבתא רינה גדלה בבית חם ומלא אהבה, שבו המטבח היה הלב הפועם של המשפחה.
                מגיל צעיר היא למדה מאמה את סודות הבישול - איך לתבל בדיוק הנכון,
                איך להרגיש את הבצק בידיים, ואיך להכין כל מנה עם אהבה אמיתית.
              </p>
            </article>

            {/* The Tradition */}
            <article className={styles.storyCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>המסורת</h2>
              <p className={styles.cardText}>
                במשך השנים, סבתא אספה מתכונים מכל מקום - מאמא שלה, מהשכנות הטובות,
                מחברות לעבודה, ומכל מקום שמצאה בו טעם מיוחד.
                היא כתבה את כולם במחברת הישנה שלה, באותיות עגולות ויפות,
                עם הערות קטנות בשוליים: "להוסיף קצת יותר קינמון" או "הילדים אוהבים עם צימוקים".
              </p>
            </article>

            {/* The Family */}
            <article className={styles.storyCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>המשפחה</h2>
              <p className={styles.cardText}>
                בכל שבת, המשפחה כולה התכנסה סביב השולחן של סבתא.
                הנכדים היו מחכים בקוצר רוח לעוגת השוקולד המפורסמת,
                והמבוגרים היו נהנים מהמרק החם והמזין.
                אלה היו הרגעים הכי יפים - כשכולם יחד, אוכלים, צוחקים, ומספרים סיפורים.
              </p>
            </article>

            {/* The Legacy */}
            <article className={styles.storyCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>המורשת</h2>
              <p className={styles.cardText}>
                היום, אנחנו ממשיכים את המסורת של סבתא.
                האתר הזה נולד מתוך רצון לשמר את המתכונים האלה לדורות הבאים,
                כדי שגם הנכדים והנינים יוכלו לטעום את אותם טעמים,
                להרגיש את אותה חמימות, ולהמשיך את סיפור המשפחה שלנו.
              </p>
            </article>
          </div>

          {/* Closing Message */}
          <div className={styles.closingSection}>
            <div className={styles.decorativeDivider}>
              <span className={styles.dividerIcon}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            </div>
            <p className={styles.closingText}>
              כל מתכון באתר הזה נושא את האהבה של סבתא, את הידע שלה,
              ואת הזיכרונות המתוקים מהמטבח שלה.
              בכל פעם שתבשלו מתכון מכאן, תרגישו קצת מהחום של הבית שלה.
            </p>
            <p className={styles.signatureText}>
              בתיאבון ובאהבה,
              <br />
              המשפחה
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

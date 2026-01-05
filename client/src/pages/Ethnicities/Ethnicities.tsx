import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './Ethnicities.module.scss';

const Ethnicities = () => {
  const [ethnicities, setEthnicities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEthnicities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/recipes/ethnicities');
        setEthnicities(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ethnicities:', err);
        setError('אירעה שגיאה בטעינת המוצאים');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEthnicities();
  }, []);

  // Emoji mapping for common ethnicities
  const getEthnicityEmoji = (ethnicity: string): string => {
    const emojiMap: Record<string, string> = {
      'תימני': '🇾🇪',
      'מרוקאי': '🇲🇦',
      'עיראקי': '🇮🇶',
      'פולני': '🇵🇱',
      'רוסי': '🇷🇺',
      'אתיופי': '🇪🇹',
      'טוניסאי': '🇹🇳',
      'לובי': '🇱🇾',
      'טורקי': '🇹🇷',
      'יווני': '🇬🇷',
      'איטלקי': '🇮🇹',
      'צרפתי': '🇫🇷',
      'ספרדי': '🇪🇸',
      'הודי': '🇮🇳',
      'אשכנזי': '🌍',
      'ספרדי-מזרחי': '🌍',
      'ישראלי': '🇮🇱',
    };
    return emojiMap[ethnicity] || '🍽️';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>עיון לפי מוצא</h1>
        <p className={styles.subtitle}>
          גלו מתכונים מסורתיים ממטבחים שונים מכל רחבי העולם
        </p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>טוען מוצאים...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>נסה שוב</button>
        </div>
      ) : ethnicities.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🌍</span>
          <h2>עדיין אין מתכונים לפי מוצא</h2>
          <p>בקרוב יתווספו כאן מתכונים ממטבחים שונים</p>
          <Link to="/recipes" className={styles.backButton}>
            לכל המתכונים
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {ethnicities.map((ethnicity) => (
            <Link
              key={ethnicity}
              to={`/recipes?ethnicity=${encodeURIComponent(ethnicity)}`}
              className={styles.card}
            >
              <span className={styles.emoji}>{getEthnicityEmoji(ethnicity)}</span>
              <h2 className={styles.cardTitle}>{ethnicity}</h2>
              <p className={styles.cardSubtitle}>לחצו לצפייה במתכונים</p>
            </Link>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Link to="/recipes" className={styles.allRecipesLink}>
          צפייה בכל המתכונים
        </Link>
      </div>
    </div>
  );
};

export default Ethnicities;

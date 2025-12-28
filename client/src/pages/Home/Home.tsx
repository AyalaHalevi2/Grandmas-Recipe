import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories } from '../../store/recipeSlice';
import styles from './Home.module.scss';

// Hebrew category names mapping
const categoryTranslations: Record<string, string> = {
  'Appetizers': 'מנות ראשונות',
  'Main Dishes': 'מנות עיקריות',
  'Main Courses': 'מנות עיקריות',
  'Desserts': 'קינוחים',
  'Soups': 'מרקים',
  'Salads': 'סלטים',
  'Beverages': 'משקאות',
  'Breakfast': 'ארוחות בוקר',
  'Snacks': 'חטיפים',
  'Side Dishes': 'תוספות',
  'Baked goods': 'מאפים',
  'Healthy & Tasty': 'בריא וטעים',
};

const categoryImages: Record<string, string> = {
  'Appetizers': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop',
  'Main Dishes': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'Main Courses': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  'Desserts': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
  'Soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
  'Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
  'Breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
  'Snacks': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop',
  'Side Dishes': 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=400&h=300&fit=crop',
  'Baked goods': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'Healthy & Tasty': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';

// Get time-based greeting
const getGreeting = (): { text: string; icon: string } => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return { text: 'בוקר טוב', icon: '🌅' };
  } else if (hour < 17) {
    return { text: 'צהריים טובים', icon: '☀️' };
  } else if (hour < 21) {
    return { text: 'ערב טוב', icon: '🌆' };
  } else {
    return { text: 'לילה טוב', icon: '🌙' };
  }
};

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, isLoading } = useAppSelector((state) => state.recipes);
  const greeting = getGreeting();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category: string) => {
    navigate(`/recipes?category=${encodeURIComponent(category)}`);
  };

  const getCategoryName = (category: string): string => {
    return categoryTranslations[category] || category;
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Time-based greeting */}
          <div className={styles.greeting}>
            <span className={styles.greetingIcon}>{greeting.icon}</span>
            <span>{greeting.text}</span>
          </div>

          <p className={styles.welcomeText}>ברוכים הבאים למטבח של</p>
          <h1 className={styles.heroTitle}>המתכונים של סבתא</h1>
          <p className={styles.heroSubtitle}>
            מתכונים שעוברים מדור לדור, טעמים שמספרים את סיפור המשפחה שלנו
          </p>

          <div className={styles.heroActions}>
            <Link to="/recipes" className={styles.primaryCta}>
              לכל המתכונים
            </Link>
            <a href="#savta-story" className={styles.secondaryCta}>
              הסיפור של סבתא
            </a>
          </div>
        </div>

        {/* Decorative wave */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path
              fill="currentColor"
              d="M0,64 C288,120 576,0 864,64 C1152,128 1296,32 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </section>

      {/* Savta's Story Section */}
      <section id="savta-story" className={styles.storySection}>
        <div className={styles.storyContent}>
          <h2 className={styles.storyTitle}>הסיפור שלנו</h2>
          <div className={styles.storyDivider} />
          <p className={styles.storyText}>
            במשך למעלה מ-50 שנה, סבתא אספה מתכונים מאמא שלה,
            מאמא של אמא שלה, ומכל בני המשפחה האהובים שעברו במטבח שלה.
          </p>
          <p className={styles.storyText}>
            כל מתכון כאן נושא את ריח הקינמון מהמטבח שלה,
            את צלילי הצחוק מארוחות השבת,
            ואת האהבה שרק סבתא יודעת לתת.
          </p>
        </div>
        <div className={styles.storyDecoration}>
          <div className={styles.decorativeSpoon}>🥄</div>
          <div className={styles.decorativePot}>🍲</div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>גלו את הקטגוריות</h2>
          <p className={styles.sectionSubtitle}>מצאו את המנה המושלמת לכל אירוע</p>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>מכינים משהו טעים...</p>
          </div>
        ) : (
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <button
                key={category}
                className={styles.categoryCard}
                onClick={() => handleCategoryClick(category)}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className={styles.categoryImage}>
                  <img
                    src={categoryImages[category] || defaultImage}
                    alt={getCategoryName(category)}
                    loading="lazy"
                  />
                </div>
                <div className={styles.categoryOverlay} />
                <h3 className={styles.categoryName}>{getCategoryName(category)}</h3>
              </button>
            ))}
          </div>
        )}

        <div className={styles.viewAllWrapper}>
          <Link to="/recipes" className={styles.viewAllButton}>
            צפייה בכל המתכונים
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>👨‍👩‍👧‍👦</div>
          <h3 className={styles.featureTitle}>מתכונים משפחתיים</h3>
          <p className={styles.featureText}>
            מתכונים שעברו מדור לדור עם אהבה וזיכרונות
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🇮🇱</div>
          <h3 className={styles.featureTitle}>טעמים תימניים</h3>
          <p className={styles.featureText}>
            מבחר מתכונים תימניים אותנטיים מהמסורת
          </p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>❤️</div>
          <h3 className={styles.featureTitle}>בישול עם אהבה</h3>
          <p className={styles.featureText}>
            כל מתכון מוכן בדיוק כמו שסבתא עשתה
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;

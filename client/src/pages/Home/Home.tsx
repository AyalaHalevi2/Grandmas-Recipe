import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories } from '../../store/recipeSlice';
import CategoryCard from '../../components/CategoryCard';
import styles from './Home.module.scss';

// Category descriptions for home page
const categoryDescriptions: Record<string, string> = {
  'Appetizers': 'התחילו את הארוחה עם מנות פתיחה קלות וטעימות שיפתחו את התיאבון',
  'Main Dishes': 'מנות עיקריות משביעות ומלאות טעם, בדיוק כמו שסבתא עשתה',
  'Main Courses': 'מנות עיקריות משביעות ומלאות טעם, בדיוק כמו שסבתא עשתה',
  'Desserts': 'קינוחים מתוקים ומפנקים לסיום מושלם של כל ארוחה',
  'Soups': 'מרקים חמים ומזינים שמחממים את הנשמה בכל עונה',
  'Salads': 'סלטים טריים וצבעוניים שמוסיפים חיות לכל שולחן',
  'Beverages': 'משקאות מרעננים וייחודיים לכל אירוע',
  'Breakfast': 'ארוחות בוקר מזינות שיתנו לכם אנרגיה ליום שלם',
  'Snacks': 'חטיפים קלים וטעימים לכל רגע ביום',
  'Side Dishes': 'תוספות מושלמות שמשלימות כל מנה עיקרית',
  'Baked goods': 'מאפים טריים מהתנור עם ריחות שמזכירים את הבית',
  'Healthy & Tasty': 'מתכונים בריאים שמוכיחים שאפשר גם ליהנות וגם לשמור על בריאות',
  'Yemeni': 'מתכונים תימניים מסורתיים שעוברים מדור לדור',
};

// Category images - using Unsplash placeholder images (replace with actual images)
const categoryImages: Record<string, string> = {
  'Appetizers': 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=1200&h=400&fit=crop',
  'Main Dishes': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
  'Main Courses': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
  'Desserts': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&h=400&fit=crop',
  'Soups': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&h=400&fit=crop',
  'Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=400&fit=crop',
  'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1200&h=400&fit=crop',
  'Breakfast': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1200&h=400&fit=crop',
  'Snacks': 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=1200&h=400&fit=crop',
  'Side Dishes': 'https://images.unsplash.com/photo-1534938665420-4193effeacc4?w=1200&h=400&fit=crop',
  'Baked goods': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=400&fit=crop',
  'Healthy & Tasty': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=400&fit=crop',
  'Yemeni': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop',
};

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

// Categories slugs to display on home page (in order)
const FEATURED_CATEGORY_SLUGS = ['main-dishes', 'desserts', 'soups', 'salads', 'baked-goods'];

const Home = () => {
  const dispatch = useAppDispatch();
  const { categories, isLoading } = useAppSelector((state) => state.recipes);
  const greeting = getGreeting();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const getCategoryDescription = (slug: string): string => {
    // Map slugs to descriptions
    const slugToKey: Record<string, string> = {
      'appetizers': 'Appetizers',
      'main-dishes': 'Main Dishes',
      'desserts': 'Desserts',
      'soups': 'Soups',
      'salads': 'Salads',
      'side-dishes': 'Side Dishes',
      'baked-goods': 'Baked goods',
      'healthy': 'Healthy & Tasty',
      'breakfast': 'Breakfast',
    };
    return categoryDescriptions[slugToKey[slug] || slug] || 'מתכונים מיוחדים מהמטבח המשפחתי שלנו';
  };

  const getCategoryImage = (slug: string): string => {
    // Map slugs to image keys
    const slugToKey: Record<string, string> = {
      'appetizers': 'Appetizers',
      'main-dishes': 'Main Dishes',
      'desserts': 'Desserts',
      'soups': 'Soups',
      'salads': 'Salads',
      'side-dishes': 'Side Dishes',
      'baked-goods': 'Baked goods',
      'healthy': 'Healthy & Tasty',
      'breakfast': 'Breakfast',
    };
    return categoryImages[slugToKey[slug] || slug] || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=400&fit=crop';
  };

  // Filter to only show categories that exist in the DB
  const displayCategories = categories.filter(cat => FEATURED_CATEGORY_SLUGS.includes(cat.slug));

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

      {/* Community CTA Section */}
      {/* <section className={styles.communitySection}>
        <div className={styles.communityContent}>
          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>👨‍👩‍👧‍👦</div>
            <h3 className={styles.communityTitle}>צרו קבוצה משפחתית</h3>
            <p className={styles.communityText}>
              הצטרפו לקהילה שלנו וצרו קבוצה משפחתית משלכם לשיתוף מתכונים עם בני המשפחה
            </p>
            <button className={styles.communityBtn} onClick={handleCreateGroup}>
              צרו קבוצה חדשה
            </button>
          </div>

          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>📝</div>
            <h3 className={styles.communityTitle}>שתפו מתכון</h3>
            <p className={styles.communityText}>
              יש לכם מתכון משפחתי מיוחד? שתפו אותו עם הקהילה והפכו אותו לחלק מהמורשת
            </p>
            <button className={styles.communityBtn} onClick={handleAddRecipe}>
              הוסיפו מתכון
            </button>
          </div>

          <div className={styles.communityCard}>
            <div className={styles.communityIcon}>🌍</div>
            <h3 className={styles.communityTitle}>גלו טעמים חדשים</h3>
            <p className={styles.communityText}>
              חקרו מתכונים ממשפחות שונות וגלו מסורות קולינריות מכל העולם
            </p>
            <Link to="/recipes" className={styles.communityBtn}>
              לכל המתכונים
            </Link>
          </div>
        </div>
      </section>

      {/* Savta's Story Section *
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
      </section> */}

      {/* Category Sections */}
      <section className={styles.categoriesSection}>
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
          <div className={styles.categoryCards}>
            {/* Yemeni Food - Featured */}
            <CategoryCard
              categoryName="Yemeni"
              hebrewName="אוכל תימני"
              description="מתכונים תימניים מסורתיים שעוברים מדור לדור"
              imageUrl="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=400&fit=crop"
              isYemeni={true}
            />

            {/* Regular Categories */}
            {displayCategories.map((category) => (
              <CategoryCard
                key={category._id}
                categoryId={category._id}
                categoryName={category.slug}
                hebrewName={category.name}
                description={getCategoryDescription(category.slug)}
                imageUrl={getCategoryImage(category.slug)}
              />
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

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCategories, fetchHomeCategoryRecipes, fetchYemeniRecipes } from '../../store/recipeSlice';
import CategoryRow from '../../components/CategoryRow';
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
  'Yemeni': 'אוכל תימני',
};

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

// Categories to display on home page (in order)
const FEATURED_CATEGORIES = ['Main Dishes', 'Desserts', 'Soups', 'Salads', 'Baked goods'];

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, categoryRecipes, categoryRecipesLoading, isLoading } = useAppSelector((state) => state.recipes);
  const { user } = useAppSelector((state) => state.auth);
  const greeting = getGreeting();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Fetch recipes for featured categories once categories are loaded
    if (categories.length > 0) {
      const categoriesToFetch = FEATURED_CATEGORIES.filter(cat => categories.includes(cat));
      if (categoriesToFetch.length > 0) {
        dispatch(fetchHomeCategoryRecipes(categoriesToFetch));
      }
    }
    // Also fetch Yemeni recipes
    dispatch(fetchYemeniRecipes(6));
  }, [dispatch, categories]);

  const handleCreateGroup = () => {
    if (user) {
      // Navigate to create group page when implemented
      navigate('/recipes');
    } else {
      navigate('/register');
    }
  };

  const handleAddRecipe = () => {
    if (user) {
      // Navigate to add recipe page when implemented
      navigate('/recipes');
    } else {
      navigate('/login');
    }
  };

  const getCategoryName = (category: string): string => {
    return categoryTranslations[category] || category;
  };

  const getCategoryDescription = (category: string): string => {
    return categoryDescriptions[category] || 'מתכונים מיוחדים מהמטבח המשפחתי שלנו';
  };

  const loading = isLoading || categoryRecipesLoading;

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

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p className={styles.loadingText}>מכינים משהו טעים...</p>
          </div>
        ) : (
          <div className={styles.categoryRows}>
            {/* Yemeni Food Row - Featured */}
            {categoryRecipes['Yemeni'] && categoryRecipes['Yemeni'].length > 0 && (
              <CategoryRow
                categoryName="Yemeni"
                hebrewName={getCategoryName('Yemeni')}
                description={getCategoryDescription('Yemeni')}
                recipes={categoryRecipes['Yemeni']}
                isYemeni={true}
              />
            )}

            {/* Regular Category Rows */}
            {FEATURED_CATEGORIES.map((category) => {
              const recipes = categoryRecipes[category] || [];
              if (recipes.length === 0) return null;

              return (
                <CategoryRow
                  key={category}
                  categoryName={category}
                  hebrewName={getCategoryName(category)}
                  description={getCategoryDescription(category)}
                  recipes={recipes}
                />
              );
            })}
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

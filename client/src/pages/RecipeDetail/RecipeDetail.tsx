import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipeById, rateRecipe, toggleFavorite } from '../../store/recipeSlice';
import { updateFavorites } from '../../store/authSlice';
import styles from './RecipeDetail.module.scss';


// Hebrew kosher type translations
const kosherTranslations: Record<string, string> = {
  'Parve': 'פרווה',
  'Dairy': 'חלבי',
  'Meat': 'בשרי',
};

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentRecipe, isLoading } = useAppSelector((state) => state.recipes);
  const { user } = useAppSelector((state) => state.auth);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Cooking Mode state
  const [isCookingMode, setIsCookingMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }
  }, [dispatch, id]);

  // Prevent body scroll when in cooking mode
  useEffect(() => {
    if (isCookingMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCookingMode]);

  // Auto-close cooking mode after completion message
  useEffect(() => {
    if (showCompletion) {
      const timer = setTimeout(() => {
        setShowCompletion(false);
        setIsCookingMode(false);
        setCurrentStep(0);
        setCheckedIngredients(new Set());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showCompletion]);

  const getDifficultyText = (difficulty: number): string => {
    const levels = ['', 'קל מאוד', 'קל', 'בינוני', 'מאתגר', 'קשה'];
    return levels[difficulty] || '';
  };

  const getKosherName = (kosherType: string): string => {
    return kosherTranslations[kosherType] || kosherType;
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUserRating(rating);
    if (id) {
      await dispatch(rateRecipe({ id, rating }));
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      const result = await dispatch(toggleFavorite(id));
      if (toggleFavorite.fulfilled.match(result)) {
        dispatch(updateFavorites({ recipeId: id, isFavorite: result.payload.isFavorite }));
      }
    }
  };

  const toggleIngredientCheck = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handleFinishCooking = () => {
    setShowCompletion(true);
  };

  const isFavorite = user?.favorites?.includes(id || '') || false;

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.recipeDetail}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>מכינים את המתכון...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!currentRecipe) {
    return (
      <div className={styles.recipeDetail}>
        <div className={styles.notFound}>
          <span className={styles.notFoundIcon}>🍽️</span>
          <p>המתכון לא נמצא</p>
          <button className={styles.backButton} onClick={() => navigate('/recipes')}>
            חזרה למתכונים
          </button>
        </div>
      </div>
    );
  }

  const totalSteps = currentRecipe.instructions.length;

  return (
    <>
      <div className={styles.recipeDetail}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/">בית</Link>
          <span className={styles.separator}>›</span>
          <Link to="/recipes">מתכונים</Link>
          <span className={styles.separator}>›</span>
          <Link to={`/recipes?category=${encodeURIComponent(currentRecipe.category?._id || '')}`}>
            {currentRecipe.category?.name}
          </Link>
          <span className={styles.separator}>›</span>
          <span className={styles.current}>{currentRecipe.title}</span>
        </nav>

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.imageSection}>
            {currentRecipe.imageUrl ? (
              <img src={currentRecipe.imageUrl} alt={currentRecipe.title} />
            ) : (
              <div className={styles.placeholder}>
                <span className={styles.placeholderIcon}>🍽️</span>
                <span className={styles.placeholderText}>תמונה בקרוב</span>
              </div>
            )}

            {/* Badges on image */}
            <div className={styles.imageBadges}>
              {currentRecipe.ethnicity && (
                <span className={`${styles.badge} ${styles.ethnicityBadge}`}>
                  🌍 {currentRecipe.ethnicity}
                </span>
              )}
              {currentRecipe.kosherType && (
                <span className={`${styles.badge} ${styles.kosherBadge} ${styles[currentRecipe.kosherType.toLowerCase()]}`}>
                  {getKosherName(currentRecipe.kosherType)}
                </span>
              )}
            </div>
          </div>

          <div className={styles.info}>
            <span className={styles.category}>
              {currentRecipe.category?.name}
            </span>

            <h1 className={styles.title}>{currentRecipe.title}</h1>

            {/* Meta Information */}
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.icon}>⏱️</span>
                <div>
                  <span className={styles.label}>זמן הכנה</span>
                  <span className={styles.value}>{currentRecipe.prepTime} דקות</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.icon}>📊</span>
                <div>
                  <span className={styles.label}>רמת קושי</span>
                  <span className={styles.value}>{getDifficultyText(currentRecipe.difficulty)}</span>
                </div>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.icon}>⭐</span>
                <div>
                  <span className={styles.label}>דירוג</span>
                  <span className={styles.value}>
                    {currentRecipe.averageRating.toFixed(1)} ({currentRecipe.ratings.length})
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                onClick={handleToggleFavorite}
                className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
              >
                <span className={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</span>
                {isFavorite ? 'במועדפים' : 'הוספה למועדפים'}
              </button>

              <button
                onClick={() => setIsCookingMode(true)}
                className={styles.cookingModeButton}
              >
                <span className={styles.cookIcon}>👨‍🍳</span>
                מצב בישול
              </button>
            </div>

            {/* Rating Section */}
            <div className={styles.ratingSection}>
              <span className={styles.ratingLabel}>דרגו את המתכון:</span>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${(hoverRating || userRating) >= star ? styles.filled : ''}`}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    ★
                  </span>
                ))}
              </div>
              {userRating > 0 && (
                <span className={styles.ratingCount}>תודה על הדירוג!</span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.content}>
          {/* Ingredients */}
          <div className={styles.ingredients}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🥕</span>
              <h2>מרכיבים</h2>
            </div>
            <ul className={styles.ingredientsList}>
              {currentRecipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className={styles.ingredientBullet} />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className={styles.instructions}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📝</span>
              <h2>הוראות הכנה</h2>
            </div>
            <ol className={styles.instructionsList}>
              {currentRecipe.instructions.map((step, index) => (
                <li key={index}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span className={styles.stepContent}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Cooking Mode Overlay */}
      {isCookingMode && (
        <div className={styles.cookingModeOverlay}>
          {showCompletion ? (
            <div className={styles.completionScreen}>
              <div className={styles.completionContent}>
                <span className={styles.completionIcon}>🍽️</span>
                <h2 className={styles.completionTitle}>בתיאבון!</h2>
                <p className={styles.completionText}>המתכון הושלם בהצלחה</p>
                <p className={styles.completionSubtext}>נסגר אוטומטית בעוד 5 שניות...</p>
              </div>
            </div>
          ) : (
            <>
              <header className={styles.cookingModeHeader}>
                <h2 className={styles.cookingModeTitle}>
                  <span className={styles.cookingIcon}>👨‍🍳</span>
                  {currentRecipe.title}
                </h2>
                <button
                  onClick={() => setIsCookingMode(false)}
                  className={styles.exitCookingMode}
                >
                  ✕ יציאה
                </button>
              </header>

              <div className={styles.cookingModeContent}>
                {/* Sidebar with ingredients */}
                <aside className={styles.cookingModeSidebar}>
                  <h3 className={styles.sidebarTitle}>
                    🥕 מרכיבים
                  </h3>
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <label
                      key={index}
                      className={`${styles.ingredientCheck} ${checkedIngredients.has(index) ? styles.checked : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedIngredients.has(index)}
                        onChange={() => toggleIngredientCheck(index)}
                      />
                      {ingredient}
                    </label>
                  ))}
                </aside>

                {/* Main step display */}
                <div className={styles.cookingModeSteps}>
                  <p className={styles.stepIndicator}>
                    שלב {currentStep + 1} מתוך {totalSteps}
                  </p>

                  <div className={styles.currentStep}>
                    <div className={styles.currentStepNumber}>{currentStep + 1}</div>
                    <p className={styles.currentStepText}>
                      {currentRecipe.instructions[currentStep]}
                    </p>
                  </div>

                  {/* Navigation buttons */}
                  <div className={styles.stepNavigation}>
                    <button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      disabled={currentStep === 0}
                      className={styles.stepNavButton}
                    >
                      → הקודם
                    </button>
                    {currentStep === totalSteps - 1 ? (
                      <button
                        onClick={handleFinishCooking}
                        className={`${styles.stepNavButton} ${styles.finishButton}`}
                      >
                        סיום 🍽️
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentStep((prev) => prev + 1)}
                        className={styles.stepNavButton}
                      >
                        הבא ←
                      </button>
                    )}
                  </div>

                  {/* Step dots */}
                  <div className={styles.stepDots}>
                    {currentRecipe.instructions.map((_, index) => (
                      <button
                        key={index}
                        className={`${styles.stepDot} ${
                          index === currentStep ? styles.active : ''
                        } ${index < currentStep ? styles.completed : ''}`}
                        onClick={() => setCurrentStep(index)}
                        aria-label={`עבור לשלב ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default RecipeDetail;

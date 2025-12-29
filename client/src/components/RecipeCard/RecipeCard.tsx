import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleFavorite } from '../../store/recipeSlice';
import { updateFavorites } from '../../store/authSlice';
import type { Recipe } from '../../types';
import styles from './RecipeCard.module.scss';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isFavorite = user?.favorites?.includes(recipe._id) || false;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    const result = await dispatch(toggleFavorite(recipe._id));
    if (toggleFavorite.fulfilled.match(result)) {
      dispatch(updateFavorites({ recipeId: recipe._id, isFavorite: result.payload.isFavorite }));
    }
  };

  const getDifficultyText = (difficulty: number): string => {
    const levels = ['', 'קל מאוד', 'קל', 'בינוני', 'מאתגר', 'קשה'];
    return levels[difficulty] || '';
  };

  const getKosherText = (kosherType: string): string => {
    const types: Record<string, string> = {
      'Parve': 'פרווה',
      'Dairy': 'חלבי',
      'Meat': 'בשרי'
    };
    return types[kosherType] || kosherType;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= roundedRating ? styles.starFilled : styles.star}>
          ★
        </span>
      );
    }
    return stars;
  };

  const cardClassName = `${styles.card} ${recipe.isYemeni ? styles.yemeni : ''}`;

  return (
    <Link
      to={`/recipe/${recipe._id}`}
      className={cardClassName}
      aria-label={`${recipe.title}, ${getDifficultyText(recipe.difficulty)}, ${recipe.prepTime} דקות`}
    >
      <div className={styles.imageContainer}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <span>🍲</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className={styles.imageOverlay} />

        {/* Category badge */}
        <span className={styles.category}>{recipe.category?.name}</span>

        {/* Favorite button */}
        <button
          className={`${styles.favoriteBtn} ${isFavorite ? styles.favorited : ''}`}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
          aria-pressed={isFavorite}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Kosher badge */}
        {recipe.kosherType && (
          <span className={`${styles.kosherBadge} ${styles[recipe.kosherType.toLowerCase()]}`}>
            {getKosherText(recipe.kosherType)}
          </span>
        )}

        {/* Yemeni badge */}
        {recipe.isYemeni && (
          <span className={styles.yemeniBadge}>תימני</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.title}</h3>

        <div className={styles.meta}>
          <span className={styles.time}>
            <span className={styles.icon}>⏱️</span>
            {recipe.prepTime} דקות
          </span>
          <span className={styles.difficulty}>
            <span className={styles.icon}>📊</span>
            {getDifficultyText(recipe.difficulty)}
          </span>
        </div>

        <div className={styles.rating}>
          <div className={styles.stars}>
            {renderStars(recipe.averageRating)}
          </div>
          <span className={styles.ratingValue}>
            ({recipe.averageRating.toFixed(1)})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;

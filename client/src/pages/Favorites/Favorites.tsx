import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import api from '../../services/api';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import type { Recipe } from '../../types';
import styles from './Favorites.module.scss';

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await api.get('/users/favorites');
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.heartIcon}>❤️</span>
          המתכונים האהובים עליי
        </h1>
        <p className={styles.subtitle}>
          המתכונים שאספתם מהמטבח של סבתא
        </p>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>טוענים את המתכונים האהובים...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIllustration}>
            <span className={styles.emptyIcon}>💝</span>
          </div>
          <h2 className={styles.emptyTitle}>עדיין אין מתכונים אהובים</h2>
          <p className={styles.emptyText}>
            לא הוספתם עדיין מתכונים למועדפים.
            <br />
            גלו את המתכונים של סבתא והוסיפו את האהובים עליכם!
          </p>
          <p className={styles.emptyHint}>
            לחצו על <span className={styles.heartExample}>❤️</span> בכרטיס המתכון כדי להוסיף למועדפים
          </p>
          <Link to="/recipes" className={styles.emptyCta}>
            גלו מתכונים
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.count}>
            <span className={styles.countNumber}>{favorites.length}</span>
            <span>מתכונים במועדפים</span>
          </div>
          <div className={styles.grid}>
            {favorites.map((recipe, index) => (
              <div
                key={recipe._id}
                className={styles.cardWrapper}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;

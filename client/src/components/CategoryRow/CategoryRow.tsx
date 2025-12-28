import { useNavigate } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';
import type { Recipe } from '../../types';
import styles from './CategoryRow.module.scss';

interface CategoryRowProps {
  categoryName: string;
  hebrewName: string;
  description: string;
  recipes: Recipe[];
  isYemeni?: boolean;
}

const CategoryRow = ({ categoryName, hebrewName, description, recipes, isYemeni = false }: CategoryRowProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (isYemeni) {
      navigate('/recipes?isYemeni=true');
    } else {
      navigate(`/recipes?category=${encodeURIComponent(categoryName)}`);
    }
  };

  if (recipes.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.categoryRow} ${isYemeni ? styles.yemeniRow : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{hebrewName}</h2>
          <p className={styles.description}>{description}</p>
        </div>
        <button
          className={styles.viewAllBtn}
          onClick={handleViewAll}
          aria-label={`צפייה בכל המתכונים בקטגוריית ${hebrewName}`}
        >
          צפייה בכל המתכונים
          <span className={styles.arrow}>&#8592;</span>
        </button>
      </div>

      <div className={styles.recipesContainer}>
        <div className={styles.recipesScroll}>
          {recipes.map((recipe) => (
            <div key={recipe._id} className={styles.recipeWrapper}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryRow;

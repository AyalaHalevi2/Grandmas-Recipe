import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.scss';

interface CategoryCardProps {
  categoryId?: string;
  categoryName: string;
  hebrewName: string;
  description: string;
  imageUrl: string;
  isYemeni?: boolean;
}

const CategoryCard = ({
  categoryId,
  categoryName,
  hebrewName,
  description,
  imageUrl,
  isYemeni = false,
}: CategoryCardProps) => {
  const linkPath = isYemeni
    ? '/recipes?isYemeni=true'
    : `/recipes?category=${encodeURIComponent(categoryId || categoryName)}`;

  return (
    <Link
      to={linkPath}
      className={`${styles.categoryCard} ${isYemeni ? styles.yemeni : ''}`}
      aria-label={`${hebrewName}: ${description}`}
    >
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={hebrewName}
          loading="lazy"
          className={styles.image}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{hebrewName}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.exploreButton}>
          גלו את המתכונים
          <span className={styles.arrow} aria-hidden="true">&#8592;</span>
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;

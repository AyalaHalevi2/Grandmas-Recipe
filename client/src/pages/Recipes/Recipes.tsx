import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipes, fetchCategories, setSearchQuery } from '../../store/recipeSlice';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import Dropdown from '../../components/Dropdown/Dropdown';
import type { KosherType } from '../../types';
import styles from './Recipes.module.scss';

const DIFFICULTY_LEVELS = [
  { value: '1', label: 'קל מאוד' },
  { value: '2', label: 'קל' },
  { value: '3', label: 'בינוני' },
  { value: '4', label: 'מאתגר' },
  { value: '5', label: 'קשה' }
];

const KOSHER_TYPES: { value: KosherType; label: string }[] = [
  { value: 'Parve', label: 'פרווה' },
  { value: 'Dairy', label: 'חלבי' },
  { value: 'Meat', label: 'בשרי' }
];

const Recipes = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, categories, searchQuery, isLoading } = useAppSelector((state) => state.recipes);
  const lastSearchRef = useRef<string>('');

  const [filters, setFilters] = useState({
    category: '',
    sortBy: '' as '' | 'title' | 'rating' | 'prepTime',
    difficulty: [] as string[],
    maxTime: '',
    isYemeni: false,
    kosherType: [] as KosherType[]
  });

  // Initialize filters from URL params and fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle search from header and category from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || '';

    setFilters((prev) => ({
      ...prev,
      category: categoryFromUrl
    }));

    // Only fetch if searchQuery changed to a new value, or on initial load
    if (searchQuery && searchQuery !== lastSearchRef.current) {
      lastSearchRef.current = searchQuery;
      dispatch(fetchRecipes({
        category: categoryFromUrl || undefined,
        search: searchQuery
      }));
      dispatch(setSearchQuery(''));
    } else if (!lastSearchRef.current) {
      // Initial load without search
      dispatch(fetchRecipes({
        category: categoryFromUrl || undefined
      }));
      lastSearchRef.current = 'initialized';
    }
  }, [dispatch, searchParams, searchQuery]);

  const handleFilterChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDifficulty = (value: string) => {
    setFilters(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(value)
        ? prev.difficulty.filter(d => d !== value)
        : [...prev.difficulty, value]
    }));
  };

  const toggleKosherType = (type: KosherType) => {
    setFilters(prev => ({
      ...prev,
      kosherType: prev.kosherType.includes(type)
        ? prev.kosherType.filter(t => t !== type)
        : [...prev.kosherType, type]
    }));
  };

  const handleApplyFilters = () => {
    // Update URL params
    const newParams = new URLSearchParams();
    if (filters.category) newParams.set('category', filters.category);
    if (filters.isYemeni) newParams.set('yemeni', 'true');
    setSearchParams(newParams);

    dispatch(fetchRecipes({
      category: filters.category || undefined,
      sortBy: filters.sortBy || undefined,
      difficulty: filters.difficulty.length > 0 ? filters.difficulty.join(',') : undefined,
      maxTime: filters.maxTime ? Number(filters.maxTime) : undefined,
      isYemeni: filters.isYemeni || undefined,
      kosherType: filters.kosherType.length > 0 ? filters.kosherType.join(',') : undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      sortBy: '',
      difficulty: [],
      maxTime: '',
      isYemeni: false,
      kosherType: []
    });
    setSearchParams({});
    lastSearchRef.current = 'cleared';
    dispatch(fetchRecipes({}));
  };

  return (
    <div className={styles.recipesPage}>
      <h1>כל המתכונים</h1>

      <div className={styles.pageLayout}>
        {/* Left Sidebar - Filters */}
        <aside className={styles.filtersSidebar}>
          <h3 className={styles.filtersTitle}>סינון</h3>

          <div className={styles.filterGroup}>
            <label>קטגוריה</label>
            <Dropdown
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="הכל"
              options={[
                { value: '', label: 'הכל' },
                ...categories.map((cat) => ({ value: cat._id, label: cat.name }))
              ]}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>מיון לפי</label>
            <Dropdown
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              placeholder="ברירת מחדל"
              options={[
                { value: '', label: 'ברירת מחדל' },
                { value: 'title', label: 'א-ת' },
                { value: 'rating', label: 'דירוג' },
                { value: 'prepTime', label: 'זמן הכנה' }
              ]}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>זמן מקסימלי (דקות)</label>
            <input
              type="number"
              name="maxTime"
              placeholder="ללא הגבלה"
              value={filters.maxTime}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>רמת קושי</label>
            <div className={styles.chipGroup}>
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={`${styles.chip} ${filters.difficulty.includes(level.value) ? styles.active : ''}`}
                  onClick={() => toggleDifficulty(level.value)}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>סוג כשרות</label>
            <div className={styles.kosherChips}>
              {KOSHER_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`${styles.kosherChip} ${styles[type.value.toLowerCase()]} ${filters.kosherType.includes(type.value) ? styles.active : ''}`}
                  onClick={() => toggleKosherType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>מיוחד</label>
            <button
              type="button"
              className={`${styles.yemeniToggle} ${filters.isYemeni ? styles.active : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, isYemeni: !prev.isYemeni }))}
            >
              {filters.isYemeni ? '✓' : ''} אוכל תימני
            </button>
          </div>

          <div className={styles.filterActions}>
            <button onClick={handleApplyFilters} className="btn btn-primary">
              החל סינון
            </button>
            <button onClick={handleClearFilters} className="btn btn-outline">
              נקה סינון
            </button>
          </div>
        </aside>

        {/* Right - Recipe Content */}
        <main className={styles.recipeContent}>
          {isLoading ? (
            <div className="loading"></div>
          ) : recipes.length === 0 ? (
            <p className={styles.noRecipes}>לא נמצאו מתכונים</p>
          ) : (
            <>
              <p className={styles.resultsCount}>נמצאו {recipes.length} מתכונים</p>
              <div className={styles.recipeGrid}>
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Recipes;

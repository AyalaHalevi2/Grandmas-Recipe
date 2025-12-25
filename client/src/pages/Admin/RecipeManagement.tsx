import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe } from '../../store/recipeSlice';
import type { Recipe, KosherType } from '../../types';
import { validate, CreateRecipeSchema } from '@grandmas-recipes/shared-schemas';
import styles from './RecipeManagement.module.scss';

const CATEGORIES = [
  'Appetizers', 'Main Courses', 'Desserts', 'Soups', 'Salads',
  'Side Dishes', 'Baked goods', 'Healthy & Tasty', 'Beverages', 'Breakfast', 'Snacks'
];

const KOSHER_TYPES: KosherType[] = ['Parve', 'Dairy', 'Meat'];

const RecipeManagement = () => {
  const dispatch = useAppDispatch();
  const { recipes, isLoading } = useAppSelector((state) => state.recipes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    difficulty: '1',
    imageUrl: '',
    isYemeni: false,
    kosherType: 'Parve' as KosherType
  });

  useEffect(() => {
    dispatch(fetchRecipes({}));
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      ingredients: '',
      instructions: '',
      prepTime: '',
      difficulty: '1',
      imageUrl: '',
      isYemeni: false,
      kosherType: 'Parve'
    });
    setEditingRecipe(null);
    setIsFormOpen(false);
    setErrors({});
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      title: recipe.title,
      category: recipe.category,
      ingredients: recipe.ingredients.join('\n'),
      instructions: recipe.instructions.join('\n'),
      prepTime: recipe.prepTime.toString(),
      difficulty: recipe.difficulty.toString(),
      imageUrl: recipe.imageUrl || '',
      isYemeni: recipe.isYemeni || false,
      kosherType: recipe.kosherType || 'Parve'
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await dispatch(deleteRecipe(id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData = {
      title: formData.title,
      category: formData.category,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      instructions: formData.instructions.split('\n').filter(i => i.trim()),
      prepTime: Number(formData.prepTime),
      difficulty: Number(formData.difficulty),
      imageUrl: formData.imageUrl || undefined,
      isYemeni: formData.isYemeni,
      kosherType: formData.kosherType
    };

    const result = validate(CreateRecipeSchema, recipeData);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    if (editingRecipe) {
      await dispatch(updateRecipe({ id: editingRecipe._id, data: result.data }));
    } else {
      await dispatch(createRecipe(result.data));
    }

    resetForm();
  };

  return (
    <div className={styles.recipeManagement}>
      <div className={styles.header}>
        <h2>Manage Recipes ({recipes.length})</h2>
        <button
          className="btn btn-primary"
          onClick={() => setIsFormOpen(true)}
        >
          + Add New Recipe
        </button>
      </div>

      {isFormOpen && (
        <div className={styles.formOverlay}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h3>{editingRecipe ? 'Edit Recipe' : 'New Recipe'}</h3>

            <div className="form-group">
              <label>Recipe Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <div className={styles.chipGroup}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`${styles.chip} ${formData.category === cat ? styles.active : ''}`}
                    onClick={() => setFormData({ ...formData, category: cat })}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <div className="form-group">
                <label>Prep Time (minutes)</label>
                <input
                  type="number"
                  value={formData.prepTime}
                  onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <div className={styles.difficultyChips}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className={`${styles.difficultyChip} ${formData.difficulty === level.toString() ? styles.active : ''}`}
                      onClick={() => setFormData({ ...formData, difficulty: level.toString() })}
                      title={['Very Easy', 'Easy', 'Medium', 'Challenging', 'Hard'][level - 1]}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.attributesRow}>
              <div className="form-group">
                <label>Yemeni Food</label>
                <div className={styles.toggleGroup}>
                  <button
                    type="button"
                    className={`${styles.toggle} ${formData.isYemeni ? styles.active : ''}`}
                    onClick={() => setFormData({ ...formData, isYemeni: !formData.isYemeni })}
                  >
                    <span className={styles.toggleIcon}>{formData.isYemeni ? '✓' : '○'}</span>
                    <span>{formData.isYemeni ? 'Yes, Yemeni Recipe' : 'Not Yemeni'}</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Kosher Type</label>
                <div className={styles.kosherChips}>
                  {KOSHER_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.kosherChip} ${styles[type.toLowerCase()]} ${formData.kosherType === type ? styles.active : ''}`}
                      onClick={() => setFormData({ ...formData, kosherType: type })}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Ingredients (one per line)</label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label>Instructions (one step per line)</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            {Object.keys(errors).length > 0 && (
              <div className={styles.validationErrors}>
                {errors.title && <p className="error-message">{errors.title}</p>}
                {errors.category && <p className="error-message">{errors.category}</p>}
                {errors.ingredients && <p className="error-message">{errors.ingredients}</p>}
                {errors.instructions && <p className="error-message">{errors.instructions}</p>}
                {errors.prepTime && <p className="error-message">{errors.prepTime}</p>}
                {errors.difficulty && <p className="error-message">{errors.difficulty}</p>}
              </div>
            )}

            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary">
                {editingRecipe ? 'Update' : 'Create Recipe'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>Category</th>
              <th>Time</th>
              <th>Difficulty</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe._id}>
                <td>{recipe.title}</td>
                <td>{recipe.category}</td>
                <td>{recipe.prepTime} min</td>
                <td>{recipe.difficulty}/5</td>
                <td>⭐ {recipe.averageRating.toFixed(1)}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(recipe)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(recipe._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecipeManagement;

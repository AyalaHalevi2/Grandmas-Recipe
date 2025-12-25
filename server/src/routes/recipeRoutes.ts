import { Router } from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  toggleFavorite,
  getCategories
} from '../controllers/recipeController';
import { isAuthenticated } from '../middleware/auth';
import { canEditRecipe, canDeleteRecipe } from '../middleware/recipeAccess';

const router = Router();

// Public routes (getAllRecipes checks access internally based on user)
router.get('/', getAllRecipes);
router.get('/categories', getCategories);
router.get('/:id', getRecipeById);

// Authenticated user routes
router.post('/:id/rate', isAuthenticated, rateRecipe);
router.post('/:id/favorite', isAuthenticated, toggleFavorite);

// Recipe CRUD - Now any authenticated user can create recipes
router.post('/', isAuthenticated, createRecipe);
router.put('/:id', isAuthenticated, canEditRecipe, updateRecipe);
router.delete('/:id', isAuthenticated, canDeleteRecipe, deleteRecipe);

export default router;

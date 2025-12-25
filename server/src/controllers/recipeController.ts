import { Request, Response } from 'express';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { validate, CreateRecipeSchema, UpdateRecipeSchema, RateRecipeSchema, RecipeIdSchema } from '@grandmas-recipes/shared-schemas';

export const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sortBy, minTime, maxTime, difficulty, isYemeni, kosherType } = req.query;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (minTime || maxTime) {
      query.prepTime = {};
      if (minTime) query.prepTime.$gte = Number(minTime);
      if (maxTime) query.prepTime.$lte = Number(maxTime);
    }

    // Support multi-select difficulty (comma-separated values)
    if (difficulty) {
      const difficultyStr = difficulty as string;
      if (difficultyStr.includes(',')) {
        const difficulties = difficultyStr.split(',').map(d => Number(d.trim()));
        query.difficulty = { $in: difficulties };
      } else {
        query.difficulty = Number(difficultyStr);
      }
    }

    // Filter by Yemeni food
    if (isYemeni === 'true') {
      query.isYemeni = true;
    }

    // Filter by kosher type (can be comma-separated for multi-select)
    if (kosherType) {
      const kosherStr = kosherType as string;
      if (kosherStr.includes(',')) {
        const types = kosherStr.split(',').map(t => t.trim());
        query.kosherType = { $in: types };
      } else {
        query.kosherType = kosherStr;
      }
    }

    let sortOption: any = { createdAt: -1 };
    if (sortBy === 'title') {
      sortOption = { title: 1 };
    } else if (sortBy === 'rating') {
      sortOption = { averageRating: -1 };
    } else if (sortBy === 'prepTime') {
      sortOption = { prepTime: 1 };
    }

    const recipes = await Recipe.find(query).sort(sortOption);
    res.json(recipes);
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({ message: 'Error loading recipes' });
  }
};

export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe by id error:', error);
    res.status(500).json({ message: 'Error loading recipe' });
  }
};

export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = validate(CreateRecipeSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { title, category, ingredients, instructions, prepTime, difficulty, imageUrl, isYemeni, kosherType } = result.data;

    const recipe = new Recipe({
      title,
      category,
      ingredients,
      instructions,
      prepTime,
      difficulty,
      imageUrl,
      isYemeni,
      kosherType
    });

    await recipe.save();
    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Error creating recipe' });
  }
};

export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const idResult = validate(RecipeIdSchema, req.params.id);
    if (!idResult.success) {
      res.status(400).json({ message: 'Invalid recipe ID' });
      return;
    }

    const result = validate(UpdateRecipeSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { title, category, ingredients, instructions, prepTime, difficulty, imageUrl, isYemeni, kosherType } = result.data;

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, category, ingredients, instructions, prepTime, difficulty, imageUrl, isYemeni, kosherType },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Error updating recipe' });
  }
};

export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
};

export const rateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.status(401).json({ message: 'Please login to rate' });
      return;
    }

    const result = validate(RateRecipeSchema, req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { rating } = result.data;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    const existingRatingIndex = recipe.ratings.findIndex(
      r => r.userId.toString() === userId
    );

    if (existingRatingIndex > -1) {
      recipe.ratings[existingRatingIndex].rating = rating;
    } else {
      recipe.ratings.push({ userId, rating });
    }

    await recipe.save();
    res.json({ message: 'Rating saved successfully', averageRating: recipe.averageRating });
  } catch (error) {
    console.error('Rate recipe error:', error);
    res.status(500).json({ message: 'Error saving rating' });
  }
};

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.status(401).json({ message: 'Please login to add to favorites' });
      return;
    }

    const recipeId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const favoriteIndex = user.favorites.findIndex(
      f => f.toString() === recipeId
    );

    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
      await user.save();
      res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      user.favorites.push(recipeId as any);
      await user.save();
      res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Error updating favorites' });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Recipe.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error loading categories' });
  }
};

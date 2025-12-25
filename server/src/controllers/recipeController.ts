import { Request, Response } from 'express';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import { Group } from '../models/Group';
import { validate, CreateRecipeSchema, UpdateRecipeSchema, RateRecipeSchema, RecipeIdSchema, UpdateRecipeVisibilitySchema } from '@grandmas-recipes/shared-schemas';

export const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, sortBy, minTime, maxTime, difficulty, isYemeni, kosherType, filter } = req.query;
    const user = (req as any).user; // May be undefined if not authenticated

    let query: any = {};

    // Access control based on user authentication and filter
    if (filter === 'mine' && user) {
      // Only user's own recipes
      query.creator = user._id;
    } else if (filter === 'mygroups' && user) {
      // Only recipes from user's groups
      const userGroups = await Group.find({ 'members.userId': user._id }, { _id: 1 }).lean();
      const groupIds = userGroups.map(g => g._id);
      query.visibility = 'group';
      query.groupIds = { $in: groupIds };
    } else if (filter === 'public' || !user) {
      // Only public recipes
      query.visibility = 'public';
    } else if (user) {
      // Default: Show all recipes user can access
      const userGroups = await Group.find({ 'members.userId': user._id }, { _id: 1 }).lean();
      const groupIds = userGroups.map(g => g._id);

      query.$or = [
        { visibility: 'public' },
        { creator: user._id },
        { visibility: 'group', groupIds: { $in: groupIds } }
      ];
    } else {
      // Not authenticated: only public recipes
      query.visibility = 'public';
    }

    // Apply other filters
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

    const user = (req as any).user;

    // Check access permissions
    if (recipe.visibility === 'public') {
      // Public recipes - anyone can view
      res.json(recipe);
      return;
    }

    if (!user) {
      // Not authenticated - can't view private/group recipes
      res.status(403).json({ message: 'Please login to view this recipe' });
      return;
    }

    // System admin can view everything
    if (user.role === 'admin') {
      res.json(recipe);
      return;
    }

    // Private recipes - only creator can view
    if (recipe.visibility === 'private') {
      if (recipe.creator?.toString() === user._id.toString()) {
        res.json(recipe);
        return;
      }
      res.status(403).json({ message: 'You do not have access to this recipe' });
      return;
    }

    // Group recipes - check if user is member of any of the groups
    if (recipe.visibility === 'group') {
      const userGroups = await Group.find({
        _id: { $in: recipe.groupIds },
        'members.userId': user._id
      });

      if (userGroups.length > 0) {
        res.json(recipe);
        return;
      }

      res.status(403).json({ message: 'You do not have access to this recipe' });
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
    const userId = (req as any).user._id;
    const result = validate(CreateRecipeSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { title, category, ingredients, instructions, prepTime, difficulty, imageUrl, isYemeni, kosherType } = result.data;

    // Extract visibility and groupIds from request (not in CreateRecipeSchema, added separately)
    const visibility = req.body.visibility || 'public';
    const groupIds = req.body.groupIds || [];

    // Validate visibility
    if (!['private', 'group', 'public'].includes(visibility)) {
      res.status(400).json({ message: 'Invalid visibility value' });
      return;
    }

    // If visibility is 'group', must have at least one group
    if (visibility === 'group' && groupIds.length === 0) {
      res.status(400).json({ message: 'Group recipes must belong to at least one group' });
      return;
    }

    // If visibility is 'group', verify user is admin or contributor in all specified groups
    if (visibility === 'group') {
      for (const groupId of groupIds) {
        const group = await Group.findById(groupId);
        if (!group) {
          res.status(404).json({ message: `Group ${groupId} not found` });
          return;
        }

        const member = group.members.find(m => m.userId.toString() === userId.toString());
        if (!member) {
          res.status(403).json({ message: `You are not a member of group: ${group.name}` });
          return;
        }

        if (member.role !== 'admin' && member.role !== 'contributor') {
          res.status(403).json({ message: `You need contributor or admin role in group: ${group.name}` });
          return;
        }
      }
    }

    const recipe = new Recipe({
      title,
      category,
      ingredients,
      instructions,
      prepTime,
      difficulty,
      imageUrl,
      isYemeni,
      kosherType,
      creator: userId,
      visibility,
      groupIds
    });

    await recipe.save();
    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error: unknown) {
    console.error('Create recipe error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Error creating recipe', error: err.message });
  }
};

export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
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

    // Extract visibility and groupIds if provided
    const updateData: any = { title, category, ingredients, instructions, prepTime, difficulty, imageUrl, isYemeni, kosherType };

    if (req.body.visibility) {
      if (!['private', 'group', 'public'].includes(req.body.visibility)) {
        res.status(400).json({ message: 'Invalid visibility value' });
        return;
      }
      updateData.visibility = req.body.visibility;
    }

    if (req.body.groupIds) {
      // If changing to group visibility, verify permissions
      if (req.body.visibility === 'group' || (await Recipe.findById(req.params.id))?.visibility === 'group') {
        const groupIds = req.body.groupIds;
        for (const groupId of groupIds) {
          const group = await Group.findById(groupId);
          if (!group) {
            res.status(404).json({ message: `Group ${groupId} not found` });
            return;
          }

          const member = group.members.find(m => m.userId.toString() === userId.toString());
          if (!member && (req as any).user.role !== 'admin') {
            res.status(403).json({ message: `You are not a member of group: ${group.name}` });
            return;
          }
        }
      }
      updateData.groupIds = req.body.groupIds;
    }

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (error: unknown) {
    console.error('Update recipe error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Error updating recipe', error: err.message });
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

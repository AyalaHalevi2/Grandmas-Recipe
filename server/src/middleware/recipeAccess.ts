import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../models/Recipe';
import { Group } from '../models/Group';

// Check if user can edit a recipe
export const canEditRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    // System admin can edit everything
    if (user.role === 'admin') {
      (req as any).recipe = recipe;
      next();
      return;
    }

    // Creator can edit their own recipes
    if (recipe.creator?.toString() === user._id.toString()) {
      (req as any).recipe = recipe;
      next();
      return;
    }

    // Group admin can edit group recipes
    if (recipe.visibility === 'group' && recipe.groupIds.length > 0) {
      const userAdminGroups = await Group.find({
        _id: { $in: recipe.groupIds },
        'members': {
          $elemMatch: {
            userId: user._id,
            role: 'admin'
          }
        }
      });

      if (userAdminGroups.length > 0) {
        (req as any).recipe = recipe;
        next();
        return;
      }
    }

    res.status(403).json({ message: 'You do not have permission to edit this recipe' });
  } catch (error: unknown) {
    console.error('Can edit recipe middleware error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

// Check if user can delete a recipe
export const canDeleteRecipe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      res.status(404).json({ message: 'Recipe not found' });
      return;
    }

    // System admin can delete everything
    if (user.role === 'admin') {
      (req as any).recipe = recipe;
      next();
      return;
    }

    // Creator can delete their own recipes
    if (recipe.creator?.toString() === user._id.toString()) {
      (req as any).recipe = recipe;
      next();
      return;
    }

    res.status(403).json({ message: 'You do not have permission to delete this recipe' });
  } catch (error: unknown) {
    console.error('Can delete recipe middleware error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

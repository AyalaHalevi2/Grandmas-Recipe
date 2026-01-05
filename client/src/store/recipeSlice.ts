import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import type { RecipeState, Recipe, RecipeFilters, Category, RecipeInput } from '../types';

const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
  categories: [],
  searchQuery: '',
  isLoading: false,
  error: null,
  categoryRecipes: {},
  categoryRecipesLoading: false
};

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async (filters: RecipeFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.minTime) params.append('minTime', filters.minTime.toString());
      if (filters.maxTime) params.append('maxTime', filters.maxTime.toString());
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.ethnicity) params.append('ethnicity', filters.ethnicity);
      if (filters.kosherType) params.append('kosherType', filters.kosherType);

      const response = await api.get(`/recipes?${params.toString()}`);
      return response.data as Recipe[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading recipes');
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data as Recipe;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading recipe');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'recipes/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recipes/categories');
      return response.data as Category[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading categories');
    }
  }
);

// Fetch recipes for multiple categories at once (for home page)
export const fetchHomeCategoryRecipes = createAsyncThunk(
  'recipes/fetchHomeCategoryRecipes',
  async (categories: string[], { rejectWithValue }) => {
    try {
      // Fetch recipes for each category in parallel (limit to 6 per category)
      const categoryPromises = categories.map(async (category) => {
        const response = await api.get(`/recipes?category=${encodeURIComponent(category)}&limit=6`);
        return { category, recipes: response.data as Recipe[] };
      });

      const results = await Promise.all(categoryPromises);

      // Convert to record format
      const categoryRecipes: Record<string, Recipe[]> = {};
      results.forEach(({ category, recipes }) => {
        categoryRecipes[category] = recipes;
      });

      return categoryRecipes;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading category recipes';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Yemeni recipes specifically (for home page)
export const fetchYemeniRecipes = createAsyncThunk(
  'recipes/fetchYemeniRecipes',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const response = await api.get(`/recipes?isYemeni=true&limit=${limit}`);
      return response.data as Recipe[];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading Yemeni recipes';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createRecipe = createAsyncThunk(
  'recipes/create',
  async (data: Partial<RecipeInput>, { rejectWithValue }) => {
    try {
      const response = await api.post('/recipes', data);
      return response.data.recipe as Recipe;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating recipe');
    }
  }
);

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async ({ id, data }: { id: string; data: Partial<RecipeInput> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/recipes/${id}`, data);
      return response.data.recipe as Recipe;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating recipe');
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  'recipes/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/recipes/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting recipe');
    }
  }
);

export const rateRecipe = createAsyncThunk(
  'recipes/rate',
  async ({ id, rating }: { id: string; rating: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/recipes/${id}/rate`, { rating });
      return { id, averageRating: response.data.averageRating };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error rating recipe');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'recipes/toggleFavorite',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/recipes/${id}/favorite`);
      return { id, isFavorite: response.data.isFavorite };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating favorites');
    }
  }
);

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch recipe by id
      .addCase(fetchRecipeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create recipe
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.recipes.unshift(action.payload);
      })
      // Update recipe
      .addCase(updateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(r => r._id === action.payload._id);
        if (index > -1) {
          state.recipes[index] = action.payload;
        }
        if (state.currentRecipe?._id === action.payload._id) {
          state.currentRecipe = action.payload;
        }
      })
      // Delete recipe
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = state.recipes.filter(r => r._id !== action.payload);
      })
      // Rate recipe
      .addCase(rateRecipe.fulfilled, (state, action) => {
        const recipe = state.recipes.find(r => r._id === action.payload.id);
        if (recipe) {
          recipe.averageRating = action.payload.averageRating;
        }
        if (state.currentRecipe?._id === action.payload.id) {
          state.currentRecipe.averageRating = action.payload.averageRating;
        }
      })
      // Fetch home category recipes
      .addCase(fetchHomeCategoryRecipes.pending, (state) => {
        state.categoryRecipesLoading = true;
      })
      .addCase(fetchHomeCategoryRecipes.fulfilled, (state, action) => {
        state.categoryRecipesLoading = false;
        state.categoryRecipes = action.payload;
      })
      .addCase(fetchHomeCategoryRecipes.rejected, (state) => {
        state.categoryRecipesLoading = false;
      })
      // Fetch Yemeni recipes
      .addCase(fetchYemeniRecipes.fulfilled, (state, action) => {
        state.categoryRecipes['Yemeni'] = action.payload;
      });
  }
});

export const { clearCurrentRecipe, clearError, setSearchQuery } = recipeSlice.actions;
export default recipeSlice.reducer;

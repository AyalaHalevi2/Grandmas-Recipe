export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'user';
  favorites: string[];
}

export interface Rating {
  userId: string;
  rating: number;
}

export type KosherType = 'Parve' | 'Dairy' | 'Meat';

export interface Recipe {
  _id: string;
  title: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  difficulty: number;
  ratings: Rating[];
  averageRating: number;
  imageUrl?: string;
  isYemeni: boolean;
  kosherType: KosherType;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  categories: string[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  // Home page category recipes - keyed by category name
  categoryRecipes: Record<string, Recipe[]>;
  categoryRecipesLoading: boolean;
}

// Category description for home page display
export interface CategoryInfo {
  name: string;
  hebrewName: string;
  description: string;
  imageUrl: string;
}

export interface RecipeFilters {
  category?: string;
  search?: string;
  sortBy?: 'title' | 'rating' | 'prepTime';
  minTime?: number;
  maxTime?: number;
  difficulty?: string; // Can be comma-separated for multi-select e.g. "1,2,3"
  isYemeni?: boolean;
  kosherType?: string; // Can be comma-separated for multi-select
}

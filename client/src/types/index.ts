export interface User {
  _id: string;
  id?: string; // Deprecated, use _id
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
export type RecipeVisibility = 'private' | 'group' | 'public';
export type GroupRole = 'admin' | 'contributor' | 'member';
export type GroupPrivacy = 'public' | 'private';

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
  creator?: string; // User ID
  visibility: RecipeVisibility;
  groupIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  userId: string;
  role: GroupRole;
  joinedAt: string;
  user?: User; // Populated by backend
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  privacy: GroupPrivacy;
  creator: string; // User ID
  members: GroupMember[];
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number; // Computed client-side
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
  filter?: 'mine' | 'mygroups' | 'public'; // New: filter by ownership
}

export interface GroupState {
  groups: Group[]; // User's groups
  publicGroups: Group[]; // Search results from public groups
  currentGroup: Group | null;
  members: GroupMember[]; // Members of the current group
  isLoading: boolean;
  error: string | null;
}

import mongoose, { Document, Schema } from 'mongoose';

export interface IRating {
  userId: mongoose.Types.ObjectId;
  rating: number;
}

export type KosherType = 'Parve' | 'Dairy' | 'Meat';
export type RecipeVisibility = 'private' | 'group' | 'public';

export interface IRecipe extends Document {
  title: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  difficulty: number;
  ratings: IRating[];
  averageRating: number;
  imageUrl?: string;
  isYemeni: boolean;
  kosherType: KosherType;
  creator: mongoose.Types.ObjectId | null;
  visibility: RecipeVisibility;
  groupIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: [{
    type: String,
    required: true
  }],
  prepTime: {
    type: Number,
    required: true,
    min: 1
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratings: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isYemeni: {
    type: Boolean,
    default: false
  },
  kosherType: {
    type: String,
    enum: ['Parve', 'Dairy', 'Meat'],
    default: 'Parve'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  visibility: {
    type: String,
    enum: ['private', 'group', 'public'],
    default: 'public'
  },
  groupIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }]
}, {
  timestamps: true
});

// Calculate average rating before saving
recipeSchema.pre('save', function() {
  if (this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  } else {
    this.averageRating = 0;
  }
});

// Indexes for performance
recipeSchema.index({ creator: 1 }); // For "My Recipes" filtering
recipeSchema.index({ visibility: 1 }); // For access control
recipeSchema.index({ groupIds: 1 }); // For group recipe filtering
recipeSchema.index({ visibility: 1, groupIds: 1 }); // Compound index for performance

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

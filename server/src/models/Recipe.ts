import mongoose, { Document, Schema } from 'mongoose';

export interface IRating {
  userId: mongoose.Types.ObjectId;
  rating: number;
}

export type KosherType = 'Parve' | 'Dairy' | 'Meat';

export interface IRecipe extends Document {
  title: string;
  category: mongoose.Types.ObjectId;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  difficulty: number;
  ratings: IRating[];
  averageRating: number;
  imageUrl?: string;
  isYemeni: boolean;
  kosherType: KosherType;
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
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
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
  }
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

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);

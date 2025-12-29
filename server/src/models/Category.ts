import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);

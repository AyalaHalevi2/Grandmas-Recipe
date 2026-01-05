import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface IGroupMember {
  userId: mongoose.Types.ObjectId;
  role: 'admin' | 'contributor' | 'member';
  joinedAt: Date;
}

export interface IGroup extends Document {
  name: string;
  description: string;
  privacy: 'public' | 'private';
  creator: mongoose.Types.ObjectId;
  members: IGroupMember[];
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    default: '',
    maxlength: 500,
    trim: true
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'contributor', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  inviteCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex')
  }
}, { timestamps: true });

// Indexes for performance
groupSchema.index({ name: 'text', description: 'text' }); // For search
groupSchema.index({ 'members.userId': 1 }); // For member lookups
// inviteCode index created automatically by unique: true
groupSchema.index({ privacy: 1 }); // For public group listings

// Generate unique invite code before saving if not set
groupSchema.pre('save', function() {
  if (!this.inviteCode) {
    this.inviteCode = crypto.randomBytes(16).toString('hex');
  }
});

export const Group = mongoose.model<IGroup>('Group', groupSchema);

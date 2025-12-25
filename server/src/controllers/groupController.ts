import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Group } from '../models/Group';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';
import {
  validate,
  CreateGroupSchema,
  UpdateGroupSchema,
  InviteMemberSchema,
  UpdateMemberRoleSchema,
  MongoIdSchema
} from '@grandmas-recipes/shared-schemas';

// Create a new group
export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const result = validate(CreateGroupSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { name, description, privacy } = result.data;

    // Create group with creator as admin
    const group = new Group({
      name,
      description: description || '',
      privacy: privacy || 'public',
      creator: userId,
      members: [{
        userId,
        role: 'admin',
        joinedAt: new Date()
      }]
    });

    await group.save();

    res.status(201).json({
      message: 'Group created successfully',
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
        privacy: group.privacy,
        creator: group.creator,
        members: group.members,
        inviteCode: group.inviteCode,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      }
    });
  } catch (error: unknown) {
    console.error('Create group error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to create group', error: err.message });
  }
};

// Get user's groups (where user is a member)
export const getMyGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const groups = await Group.find({
      'members.userId': userId
    }).sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error: unknown) {
    console.error('Get my groups error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to retrieve groups', error: err.message });
  }
};

// Search public groups
export const getPublicGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const query: any = { privacy: 'public' };

    // Text search if search param provided
    if (search && typeof search === 'string') {
      query.$text = { $search: search };
    }

    const groups = await Group.find(query).sort({ createdAt: -1 });

    res.json(groups);
  } catch (error: unknown) {
    console.error('Get public groups error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to retrieve public groups', error: err.message });
  }
};

// Get group by ID (with member details populated)
export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id).populate('members.userId', 'email fullName role');

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    res.json(group);
  } catch (error: unknown) {
    console.error('Get group by ID error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to retrieve group', error: err.message });
  }
};

// Update group (admin only)
export const updateGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = validate(UpdateGroupSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const group = await Group.findByIdAndUpdate(
      id,
      { $set: result.data },
      { new: true, runValidators: true }
    );

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    res.json({
      message: 'Group updated successfully',
      group
    });
  } catch (error: unknown) {
    console.error('Update group error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to update group', error: err.message });
  }
};

// Delete group (creator only - enforced by middleware)
export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Remove groupId from all recipes
    await Recipe.updateMany(
      { groupIds: id },
      { $pull: { groupIds: id } }
    );

    // If recipe has no more groups and visibility='group', change to private
    await Recipe.updateMany(
      { visibility: 'group', groupIds: { $size: 0 } },
      { $set: { visibility: 'private' } }
    );

    // Delete the group
    await Group.findByIdAndDelete(id);

    res.json({ message: 'Group deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete group error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to delete group', error: err.message });
  }
};

// Join public group
export const joinPublicGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (group.privacy !== 'public') {
      res.status(403).json({ message: 'This group is private. You need an invite link to join.' });
      return;
    }

    // Check if already a member
    const isMember = group.members.some(m => m.userId.toString() === userId.toString());
    if (isMember) {
      res.status(400).json({ message: 'You are already a member of this group' });
      return;
    }

    // Add user as member
    group.members.push({
      userId,
      role: 'member',
      joinedAt: new Date()
    });

    await group.save();

    res.json({
      message: 'Successfully joined group',
      group
    });
  } catch (error: unknown) {
    console.error('Join public group error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to join group', error: err.message });
  }
};

// Join via invite link
export const joinViaInvite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { inviteCode } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      res.status(404).json({ message: 'Invalid invite link' });
      return;
    }

    // Check if already a member
    const isMember = group.members.some(m => m.userId.toString() === userId.toString());
    if (isMember) {
      res.status(400).json({ message: 'You are already a member of this group' });
      return;
    }

    // Add user as member
    group.members.push({
      userId,
      role: 'member',
      joinedAt: new Date()
    });

    await group.save();

    res.json({
      message: 'Successfully joined group',
      group
    });
  } catch (error: unknown) {
    console.error('Join via invite error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to join group', error: err.message });
  }
};

// Leave group
export const leaveGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findById(id);

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Check if user is the creator
    if (group.creator.toString() === userId.toString()) {
      res.status(403).json({ message: 'Group creator cannot leave the group. Delete it instead.' });
      return;
    }

    // Remove user from members
    group.members = group.members.filter(m => m.userId.toString() !== userId.toString());

    await group.save();

    res.json({ message: 'Successfully left group' });
  } catch (error: unknown) {
    console.error('Leave group error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to leave group', error: err.message });
  }
};

// Get group members (populated with user details)
export const getMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const group = await Group.findById(id).populate('members.userId', 'email fullName role');

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    res.json(group.members);
  } catch (error: unknown) {
    console.error('Get members error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to retrieve members', error: err.message });
  }
};

// Invite user by email (admin only)
export const inviteMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = validate(InviteMemberSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { email } = result.data;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User with this email not found' });
      return;
    }

    // Check if already a member
    const isMember = group.members.some(m => m.userId.toString() === user._id.toString());
    if (isMember) {
      res.status(400).json({ message: 'User is already a member of this group' });
      return;
    }

    // Add user as member
    group.members.push({
      userId: user._id as mongoose.Types.ObjectId,
      role: 'member',
      joinedAt: new Date()
    });

    await group.save();

    res.json({
      message: 'User invited successfully',
      group
    });
  } catch (error: unknown) {
    console.error('Invite member error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to invite member', error: err.message });
  }
};

// Update member role (admin only)
export const updateMemberRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;
    const result = validate(UpdateMemberRoleSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { role } = result.data;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Find member
    const member = group.members.find(m => m.userId.toString() === userId);
    if (!member) {
      res.status(404).json({ message: 'User is not a member of this group' });
      return;
    }

    // Update role
    member.role = role;
    await group.save();

    res.json({
      message: 'Member role updated successfully',
      group
    });
  } catch (error: unknown) {
    console.error('Update member role error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to update member role', error: err.message });
  }
};

// Remove member (admin only)
export const removeMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, userId } = req.params;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Prevent removing the creator
    if (group.creator.toString() === userId) {
      res.status(403).json({ message: 'Cannot remove the group creator' });
      return;
    }

    // Remove member
    const initialLength = group.members.length;
    group.members = group.members.filter(m => m.userId.toString() !== userId);

    if (group.members.length === initialLength) {
      res.status(404).json({ message: 'User is not a member of this group' });
      return;
    }

    await group.save();

    res.json({
      message: 'Member removed successfully',
      group
    });
  } catch (error: unknown) {
    console.error('Remove member error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Failed to remove member', error: err.message });
  }
};

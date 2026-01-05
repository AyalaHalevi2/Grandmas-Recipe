import { Request, Response } from 'express';
import { User } from '../models/User';
import { Group } from '../models/Group';
import { Recipe } from '../models/Recipe';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('email fullName role createdAt');
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error loading users' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email, fullName, role } = req.body;

    // Validate role if provided
    if (role && !['sysadmin', 'user'].includes(role)) {
      res.status(400).json({ message: 'Invalid role. Must be sysadmin or user' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update fields if provided
    if (email) user.email = email;
    if (fullName) user.fullName = fullName;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUser = (req as Request & { user: { _id: string } }).user;

    // Prevent self-deletion
    if (id === currentUser._id.toString()) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove user from all groups they're a member of
    await Group.updateMany(
      { 'members.userId': id },
      { $pull: { members: { userId: id } } }
    );

    // For groups where user is the creator, transfer ownership or delete
    const createdGroups = await Group.find({ creator: id });
    for (const group of createdGroups) {
      // Find another admin in the group
      const otherAdmin = group.members.find(
        m => m.userId.toString() !== id && m.role === 'admin'
      );

      if (otherAdmin) {
        // Transfer ownership
        group.creator = otherAdmin.userId;
        await group.save();
      } else if (group.members.length > 1) {
        // Promote first member to admin and make them creator
        const firstMember = group.members.find(m => m.userId.toString() !== id);
        if (firstMember) {
          firstMember.role = 'admin';
          group.creator = firstMember.userId;
          await group.save();
        }
      } else {
        // Delete the group if only member
        await Group.findByIdAndDelete(group._id);
      }
    }

    // Update recipes: set creator to null or mark as orphaned
    await Recipe.updateMany(
      { creator: id },
      { $unset: { creator: '' } }
    );

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

export const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.status(401).json({ message: 'Please login' });
      return;
    }

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user.favorites);
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ message: 'Error loading favorites' });
  }
};

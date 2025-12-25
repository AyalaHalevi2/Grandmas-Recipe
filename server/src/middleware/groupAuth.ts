import { Request, Response, NextFunction } from 'express';
import { Group } from '../models/Group';

// Check if user is a member of the group
export const isGroupMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const isMember = group.members.some(m => m.userId.toString() === userId.toString());
    if (!isMember) {
      res.status(403).json({ message: 'You are not a member of this group' });
      return;
    }

    (req as any).group = group;
    next();
  } catch (error: unknown) {
    console.error('Group member middleware error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

// Check if user is an admin of the group
export const isGroupAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const member = group.members.find(m => m.userId.toString() === userId.toString());
    if (!member) {
      res.status(403).json({ message: 'You are not a member of this group' });
      return;
    }

    if (member.role !== 'admin' && group.creator.toString() !== userId.toString()) {
      res.status(403).json({ message: 'You must be a group admin to perform this action' });
      return;
    }

    (req as any).group = group;
    next();
  } catch (error: unknown) {
    console.error('Group admin middleware error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

// Check if user is the creator of the group
export const isGroupCreator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (group.creator.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Only the group creator can perform this action' });
      return;
    }

    (req as any).group = group;
    next();
  } catch (error: unknown) {
    console.error('Group creator middleware error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

// Helper: Check if user is admin or contributor in group (for recipe creation)
export const isGroupContributor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const group = await Group.findById(id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const member = group.members.find(m => m.userId.toString() === userId.toString());
    if (!member) {
      res.status(403).json({ message: 'You are not a member of this group' });
      return;
    }

    if (member.role !== 'admin' && member.role !== 'contributor') {
      res.status(403).json({ message: 'You need contributor or admin role to add recipes' });
      return;
    }

    (req as any).group = group;
    next();
  } catch (error: unknown) {
    console.error('Group contributor middleware error:', error);
    const err = error as Error;
    res.status(500).json({ message: 'Authorization error', error: err.message });
  }
};

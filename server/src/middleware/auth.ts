import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.status(401).json({ message: 'Please login' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.clearCookie('userId');
      res.status(401).json({ message: 'User not found' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.status(401).json({ message: 'Please login' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.clearCookie('userId');
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (user.role !== 'sysadmin') {
      res.status(403).json({ message: 'Not authorized to perform this action' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

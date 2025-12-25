import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User';
import { validate, RegisterSchema, LoginSchema } from '@grandmas-recipes/shared-schemas';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Registration request body:', req.body);
    const result = validate(RegisterSchema, req.body);
    console.log('Validation result:', result);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { email, fullName, password } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const user = new User({
      email,
      fullName,
      password,
      role: 'user'
    });

    await user.save();

    res.cookie('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = validate(LoginSchema, req.body);

    if (!result.success) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.cookie('userId', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('userId');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout error' });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      res.status(401).json({ message: 'Not logged in' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.clearCookie('userId');
      res.status(401).json({ message: 'Invalid session' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.clearCookie('userId');
      res.status(401).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        favorites: user.favorites
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Error getting user details' });
  }
};

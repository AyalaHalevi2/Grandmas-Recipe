import { Router } from 'express';
import { getAllUsers, getUserFavorites, updateUser, deleteUser } from '../controllers/userController';
import { isAdmin, isAuthenticated } from '../middleware/auth';

const router = Router();

// Admin only - get all users
router.get('/', isAdmin, getAllUsers);

// Authenticated user - get favorites
router.get('/favorites', isAuthenticated, getUserFavorites);

// SysAdmin only - update user
router.put('/:id', isAdmin, updateUser);

// SysAdmin only - delete user
router.delete('/:id', isAdmin, deleteUser);

export default router;

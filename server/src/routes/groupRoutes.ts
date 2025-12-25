import { Router } from 'express';
import {
  createGroup,
  getMyGroups,
  getPublicGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinPublicGroup,
  joinViaInvite,
  leaveGroup,
  getMembers,
  inviteMember,
  updateMemberRole,
  removeMember
} from '../controllers/groupController';
import { isAuthenticated } from '../middleware/auth';
import { isGroupMember, isGroupAdmin, isGroupCreator } from '../middleware/groupAuth';

const router = Router();

// All routes require authentication
router.use(isAuthenticated);

// Group CRUD routes
router.post('/', createGroup);                              // Create group
router.get('/', getMyGroups);                               // Get user's groups
router.get('/public', getPublicGroups);                     // Search public groups
router.get('/:id', isGroupMember, getGroupById);            // Get group details (members only)
router.put('/:id', isGroupAdmin, updateGroup);              // Update group (admin only)
router.delete('/:id', isGroupCreator, deleteGroup);         // Delete group (creator only)

// Membership routes
router.post('/:id/join', joinPublicGroup);                  // Join public group
router.post('/join/:inviteCode', joinViaInvite);            // Join via invite link
router.post('/:id/leave', leaveGroup);                      // Leave group
router.get('/:id/members', isGroupMember, getMembers);      // Get members (members only)
router.post('/:id/invite', isGroupAdmin, inviteMember);     // Invite member (admin only)
router.put('/:id/members/:userId', isGroupAdmin, updateMemberRole); // Update role (admin only)
router.delete('/:id/members/:userId', isGroupAdmin, removeMember);  // Remove member (admin only)

export default router;

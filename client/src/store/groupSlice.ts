import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import type { GroupState, Group } from '../types';

const initialState: GroupState = {
  groups: [],
  publicGroups: [],
  currentGroup: null,
  members: [],
  isLoading: false,
  error: null
};

// Fetch user's groups
export const fetchMyGroups = createAsyncThunk(
  'groups/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/groups');
      return response.data as Group[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading groups');
    }
  }
);

// Search public groups
export const fetchPublicGroups = createAsyncThunk(
  'groups/fetchPublic',
  async (search: string | undefined, { rejectWithValue }) => {
    try {
      const url = search ? `/groups/public?search=${encodeURIComponent(search)}` : '/groups/public';
      const response = await api.get(url);
      return response.data as Group[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading public groups');
    }
  }
);

// Fetch group by ID
export const fetchGroupById = createAsyncThunk(
  'groups/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/groups/${id}`);
      return response.data as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading group');
    }
  }
);

// Create group
export const createGroup = createAsyncThunk(
  'groups/create',
  async (data: { name: string; description?: string; privacy?: 'public' | 'private' }, { rejectWithValue }) => {
    try {
      const response = await api.post('/groups', data);
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating group');
    }
  }
);

// Update group
export const updateGroup = createAsyncThunk(
  'groups/update',
  async ({ id, data }: { id: string; data: Partial<Group> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/groups/${id}`, data);
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating group');
    }
  }
);

// Delete group
export const deleteGroup = createAsyncThunk(
  'groups/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/groups/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting group');
    }
  }
);

// Join public group
export const joinPublicGroup = createAsyncThunk(
  'groups/joinPublic',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/groups/${id}/join`);
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error joining group');
    }
  }
);

// Join via invite link
export const joinViaInvite = createAsyncThunk(
  'groups/joinInvite',
  async (inviteCode: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/groups/join/${inviteCode}`);
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid or expired invite link');
    }
  }
);

// Leave group
export const leaveGroup = createAsyncThunk(
  'groups/leave',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.post(`/groups/${id}/leave`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error leaving group');
    }
  }
);

// Fetch group members
export const fetchGroupMembers = createAsyncThunk(
  'groups/fetchMembers',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/groups/${id}/members`);
      return { groupId: id, members: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading members');
    }
  }
);

// Invite member by email
export const inviteMember = createAsyncThunk(
  'groups/invite',
  async ({ id, email }: { id: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/groups/${id}/invite`, { email });
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error inviting member');
    }
  }
);

// Update member role
export const updateMemberRole = createAsyncThunk(
  'groups/updateMemberRole',
  async ({ id, userId, role }: { id: string; userId: string; role: 'admin' | 'contributor' | 'member' }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/groups/${id}/members/${userId}`, { role });
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating member role');
    }
  }
);

// Remove member
export const removeMember = createAsyncThunk(
  'groups/removeMember',
  async ({ id, userId }: { id: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/groups/${id}/members/${userId}`);
      return response.data.group as Group;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error removing member');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch My Groups
    builder
      .addCase(fetchMyGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Public Groups
    builder
      .addCase(fetchPublicGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicGroups = action.payload;
      })
      .addCase(fetchPublicGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Group By ID
    builder
      .addCase(fetchGroupById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGroup = action.payload;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Group
    builder
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups.unshift(action.payload); // Add to beginning
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Group
    builder
      .addCase(updateGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.groups.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.currentGroup?._id === action.payload._id) {
          state.currentGroup = action.payload;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Group
    builder
      .addCase(deleteGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = state.groups.filter(g => g._id !== action.payload);
        if (state.currentGroup?._id === action.payload) {
          state.currentGroup = null;
        }
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Join Public Group
    builder
      .addCase(joinPublicGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
        // Also remove from publicGroups if exists
        state.publicGroups = state.publicGroups.filter(g => g._id !== action.payload._id);
      });

    // Join Via Invite
    builder
      .addCase(joinViaInvite.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      });

    // Leave Group
    builder
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => g._id !== action.payload);
        if (state.currentGroup?._id === action.payload) {
          state.currentGroup = null;
        }
      });

    // Update member role / invite / remove member all return updated group
    builder
      .addCase(inviteMember.fulfilled, (state, action) => {
        if (state.currentGroup?._id === action.payload._id) {
          state.currentGroup = action.payload;
        }
        const index = state.groups.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        if (state.currentGroup?._id === action.payload._id) {
          state.currentGroup = action.payload;
        }
        const index = state.groups.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        if (state.currentGroup?._id === action.payload._id) {
          state.currentGroup = action.payload;
        }
        const index = state.groups.findIndex(g => g._id === action.payload._id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      });

    // Fetch Group Members
    builder
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.members = action.payload.members;
      });
  }
});

export const { clearCurrentGroup, clearError } = groupSlice.actions;
export default groupSlice.reducer;

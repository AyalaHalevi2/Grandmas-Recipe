import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import type { AuthState, User } from '../types';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; fullName: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data.user as User;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string> } } };
      const serverErrors = axiosError.response?.data?.errors;
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors).join(', ');
        return rejectWithValue(errorMessages);
      }
      return rejectWithValue(axiosError.response?.data?.message || 'Registration error');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', data);
      return response.data.user as User;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; errors?: Record<string, string> } } };
      const serverErrors = axiosError.response?.data?.errors;
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors).join(', ');
        return rejectWithValue(errorMessages);
      }
      return rejectWithValue(axiosError.response?.data?.message || 'Login error');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(axiosError.response?.data?.message || 'Logout error');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user as User;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(axiosError.response?.data?.message || 'Not logged in');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateFavorites: (state, action: { payload: { recipeId: string; isFavorite: boolean } }) => {
      if (state.user) {
        // Ensure favorites array exists
        if (!state.user.favorites) {
          state.user.favorites = [];
        }
        if (action.payload.isFavorite) {
          if (!state.user.favorites.includes(action.payload.recipeId)) {
            state.user.favorites.push(action.payload.recipeId);
          }
        } else {
          state.user.favorites = state.user.favorites.filter(id => id !== action.payload.recipeId);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  }
});

export const { clearError, updateFavorites } = authSlice.actions;
export default authSlice.reducer;

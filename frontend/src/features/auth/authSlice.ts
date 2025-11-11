import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Role } from '../../types';
import { authApi } from './authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const token = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token,
  isAuthenticated: !!token, // Set to true if token exists
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        console.log(action.payload);
        state.user = action.payload!.data!.user;
        state.token = action.payload!.data!.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload!.data!.token);
      })
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, action) => {
          console.log(action.payload);
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      );
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.role;
export const selectHasRole = (roles: Role[]) => (state: { auth: AuthState }) =>
  state.auth.user ? roles.includes(state.auth.user.role) : false;

export default authSlice.reducer;

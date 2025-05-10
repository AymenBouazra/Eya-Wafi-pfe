import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
 selectAuthState,
 (state: AuthState) => state.token
);

export const selectRole = createSelector(
 selectAuthState,
 (state: AuthState) => state.role
);

export const selectIsAuthenticated = createSelector(
 selectToken,
 (token) => !!token
);
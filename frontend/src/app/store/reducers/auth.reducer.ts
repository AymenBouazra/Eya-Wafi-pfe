import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../auth.actions';

export interface AuthState {
 token: string | null;
 role: string | null;
}

export const initialState: AuthState = {
 token: localStorage.getItem('token') || null,
 role: localStorage.getItem('role') || null
};

export const authReducer = createReducer(
 initialState,
 on(AuthActions.loginSuccess, (state, { token, role }) => ({
  ...state,
  token,
  role
 })),
 on(AuthActions.logout, (state) => ({
  ...state,
  token: null,
  role: null
 }))
);
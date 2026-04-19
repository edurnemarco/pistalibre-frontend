import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      user,
      token,
      loading: false,
      error: null,
    };
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.registerSuccess, (state, { user, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      user,
      token,
      loading: false,
      error: null,
    };
  }),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Logout
  on(AuthActions.logoutSuccess, (state) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      ...state,
      user: null,
      token: null,
      loading: false,
      error: null,
    };
  }),

  // Cargar desde localStorage
  on(AuthActions.loadUserFromStorageSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
  })),

  //Guardar cambios perfil
  on(AuthActions.updateUserSuccess, (state, { user }) => {
    localStorage.setItem('user', JSON.stringify(user));
    return {
      ...state,
      user,
    };
  }),
);

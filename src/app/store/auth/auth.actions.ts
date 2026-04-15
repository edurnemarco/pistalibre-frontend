import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>(),
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// Register
export const register = createAction(
  '[Auth] Register',
  props<{
    nombre: string;
    email: string;
    password: string;
    tipo: 'artista' | 'institucion';
    apellidos?: string;
    ciudad?: string;
    region?: string;
    pais?: string;
    web?: string;
  }>(),
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>(),
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

// Logout
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// Cargar usuario desde localStorage al arrancar la app
export const loadUserFromStorage = createAction(
  '[Auth] Load User From Storage',
);
export const loadUserFromStorageSuccess = createAction(
  '[Auth] Load User From Storage Success',
  props<{ user: User; token: string }>(),
);

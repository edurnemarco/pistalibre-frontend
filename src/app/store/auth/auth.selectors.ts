import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user,
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token,
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => !!state.token,
);

export const selectUserTipo = createSelector(
  selectAuthState,
  (state) => state.user?.tipo,
);

export const selectIsAdmin = createSelector(
  selectAuthState,
  (state) => state.user?.tipo === 'admin',
);

export const selectIsInstitucion = createSelector(
  selectAuthState,
  (state) => state.user?.tipo === 'institucion',
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading,
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error,
);

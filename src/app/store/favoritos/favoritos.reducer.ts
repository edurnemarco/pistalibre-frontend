import { createReducer, on } from '@ngrx/store';
import * as FavoritosActions from './favoritos.actions';
import { initialFavoritosState } from './favoritos.state';

export const favoritosReducer = createReducer(
  initialFavoritosState,

  on(FavoritosActions.cargarFavoritos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritosActions.cargarFavoritosSuccess, (state, { favoritos }) => ({
    ...state,
    favoritos,
    loading: false,
    error: null,
  })),

  on(FavoritosActions.cargarFavoritosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FavoritosActions.addFavoritoSuccess, (state, { favorito }) => ({
    ...state,
    favoritos: [...state.favoritos, favorito],
  })),

  on(FavoritosActions.deleteFavoritoSuccess, (state, { favoritoId }) => ({
    ...state,
    favoritos: state.favoritos.filter((f) => f.id !== favoritoId),
  })),
);

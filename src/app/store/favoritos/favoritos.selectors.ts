import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritosState } from './favoritos.state';

export const selectFavoritosState =
  createFeatureSelector<FavoritosState>('favoritos');

export const selectFavoritos = createSelector(
  selectFavoritosState,
  (state) => state.favoritos,
);

export const selectFavoritosLoading = createSelector(
  selectFavoritosState,
  (state) => state.loading,
);

export const selectIsFavorito = (convocatoriaId: string) =>
  createSelector(selectFavoritos, (favoritos) =>
    favoritos.some((f) => f.convocatoria_id === convocatoriaId),
  );

export const selectFavoritoId = (convocatoriaId: string) =>
  createSelector(
    selectFavoritos,
    (favoritos) =>
      favoritos.find((f) => f.convocatoria_id === convocatoriaId)?.id,
  );

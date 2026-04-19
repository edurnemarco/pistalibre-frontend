import { createAction, props } from '@ngrx/store';
import { Favorito } from './favoritos.state';

export const cargarFavoritos = createAction('[Favoritos] Cargar');

export const cargarFavoritosSuccess = createAction(
  '[Favoritos] Cargar Success',
  props<{ favoritos: Favorito[] }>(),
);

export const cargarFavoritosFailure = createAction(
  '[Favoritos] Cargar Failure',
  props<{ error: string }>(),
);

export const addFavorito = createAction(
  '[Favoritos] Add',
  props<{ convocatoriaId: string }>(),
);

export const addFavoritoSuccess = createAction(
  '[Favoritos] Add Success',
  props<{ favorito: Favorito }>(),
);

export const addFavoritoFailure = createAction(
  '[Favoritos] Add Failure',
  props<{ error: string }>(),
);

export const deleteFavorito = createAction(
  '[Favoritos] Delete',
  props<{ favoritoId: string }>(),
);

export const deleteFavoritoSuccess = createAction(
  '[Favoritos] Delete Success',
  props<{ favoritoId: string }>(),
);

export const deleteFavoritoFailure = createAction(
  '[Favoritos] Delete Failure',
  props<{ error: string }>(),
);

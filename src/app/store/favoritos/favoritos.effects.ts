import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { FavoritosService } from '../../services/favoritos.service';
import { selectToken } from '../auth/auth.selectors';
import * as FavoritosActions from './favoritos.actions';

@Injectable()
export class FavoritosEffects {
  private actions$ = inject(Actions);
  private favoritosService = inject(FavoritosService);
  private store = inject(Store);

  cargarFavoritos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritosActions.cargarFavoritos),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([, token]) => {
        if (!token)
          return of(
            FavoritosActions.cargarFavoritosFailure({ error: 'No token' }),
          );
        return this.favoritosService.getFavoritos(token).pipe(
          map((favoritos) =>
            FavoritosActions.cargarFavoritosSuccess({ favoritos }),
          ),
          catchError((error) =>
            of(
              FavoritosActions.cargarFavoritosFailure({ error: error.message }),
            ),
          ),
        );
      }),
    ),
  );

  addFavorito$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritosActions.addFavorito),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ convocatoriaId }, token]) => {
        if (!token)
          return of(FavoritosActions.addFavoritoFailure({ error: 'No token' }));
        return this.favoritosService.addFavorito(token, convocatoriaId).pipe(
          map((favorito) => FavoritosActions.addFavoritoSuccess({ favorito })),
          catchError((error) =>
            of(FavoritosActions.addFavoritoFailure({ error: error.message })),
          ),
        );
      }),
    ),
  );

  addFavoritoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritosActions.addFavoritoSuccess),
      map(() => FavoritosActions.cargarFavoritos()),
    ),
  );
  deleteFavorito$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoritosActions.deleteFavorito),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ favoritoId }, token]) => {
        if (!token)
          return of(
            FavoritosActions.deleteFavoritoFailure({ error: 'No token' }),
          );
        return this.favoritosService.deleteFavorito(token, favoritoId).pipe(
          map(() => FavoritosActions.deleteFavoritoSuccess({ favoritoId })),
          catchError((error) =>
            of(
              FavoritosActions.deleteFavoritoFailure({ error: error.message }),
            ),
          ),
        );
      }),
    ),
  );
}

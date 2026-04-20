import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ParticipacionesService } from '../../services/participaciones.service';
import { selectToken } from '../auth/auth.selectors';
import * as ParticipacionesActions from './participaciones.actions';

@Injectable()
export class ParticipacionesEffects {
  private actions$ = inject(Actions);
  private participacionesService = inject(ParticipacionesService);
  private store = inject(Store);

  cargarParticipaciones$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParticipacionesActions.cargarParticipaciones),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([, token]) => {
        if (!token)
          return of(
            ParticipacionesActions.cargarParticipacionesFailure({
              error: 'No token',
            }),
          );
        return this.participacionesService.getParticipaciones(token).pipe(
          map((participaciones) =>
            ParticipacionesActions.cargarParticipacionesSuccess({
              participaciones,
            }),
          ),
          catchError((error) =>
            of(
              ParticipacionesActions.cargarParticipacionesFailure({
                error: error.message,
              }),
            ),
          ),
        );
      }),
    ),
  );

  createParticipacion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParticipacionesActions.createParticipacion),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ data }, token]) => {
        if (!token)
          return of(
            ParticipacionesActions.createParticipacionFailure({
              error: 'No token',
            }),
          );
        return this.participacionesService
          .createParticipacion(token, data)
          .pipe(
            map((participacion) =>
              ParticipacionesActions.createParticipacionSuccess({
                participacion,
              }),
            ),
            catchError((error) =>
              of(
                ParticipacionesActions.createParticipacionFailure({
                  error: error.message,
                }),
              ),
            ),
          );
      }),
    ),
  );

  updateParticipacion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParticipacionesActions.updateParticipacion),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ id, data }, token]) => {
        if (!token)
          return of(
            ParticipacionesActions.updateParticipacionFailure({
              error: 'No token',
            }),
          );
        return this.participacionesService
          .updateParticipacion(token, id, data)
          .pipe(
            map((participacion) =>
              ParticipacionesActions.updateParticipacionSuccess({
                participacion,
              }),
            ),
            catchError((error) =>
              of(
                ParticipacionesActions.updateParticipacionFailure({
                  error: error.message,
                }),
              ),
            ),
          );
      }),
    ),
  );

  deleteParticipacion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParticipacionesActions.deleteParticipacion),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ id }, token]) => {
        if (!token)
          return of(
            ParticipacionesActions.deleteParticipacionFailure({
              error: 'No token',
            }),
          );
        return this.participacionesService.deleteParticipacion(token, id).pipe(
          map(() => ParticipacionesActions.deleteParticipacionSuccess({ id })),
          catchError((error) =>
            of(
              ParticipacionesActions.deleteParticipacionFailure({
                error: error.message,
              }),
            ),
          ),
        );
      }),
    ),
  );
}

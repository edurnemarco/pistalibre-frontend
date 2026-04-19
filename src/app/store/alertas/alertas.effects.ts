import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AlertasService } from '../../services/alertas.service';
import { selectToken } from '../auth/auth.selectors';
import * as AlertasActions from './alertas.actions';

@Injectable()
export class AlertasEffects {
  private actions$ = inject(Actions);
  private alertasService = inject(AlertasService);
  private store = inject(Store);

  cargarAlertas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertasActions.cargarAlertas),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([, token]) => {
        if (!token)
          return of(AlertasActions.cargarAlertasFailure({ error: 'No token' }));
        return this.alertasService.getAlertas(token).pipe(
          map((alertas) => AlertasActions.cargarAlertasSuccess({ alertas })),
          catchError((error) =>
            of(AlertasActions.cargarAlertasFailure({ error: error.message })),
          ),
        );
      }),
    ),
  );

  createAlerta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertasActions.createAlerta),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ convocatoriaId, diasAntes }, token]) => {
        if (!token)
          return of(AlertasActions.createAlertaFailure({ error: 'No token' }));
        return this.alertasService
          .createAlerta(token, {
            convocatoria_id: convocatoriaId,
            dias_antes: diasAntes,
          })
          .pipe(
            map((alerta) => AlertasActions.createAlertaSuccess({ alerta })),
            catchError((error) =>
              of(AlertasActions.createAlertaFailure({ error: error.message })),
            ),
          );
      }),
    ),
  );

  createAlertaSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertasActions.createAlertaSuccess),
      map(() => AlertasActions.cargarAlertas()),
    ),
  );

  deleteAlerta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertasActions.deleteAlerta),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ alertaId }, token]) => {
        if (!token)
          return of(AlertasActions.deleteAlertaFailure({ error: 'No token' }));
        return this.alertasService.deleteAlerta(token, alertaId).pipe(
          map(() => AlertasActions.deleteAlertaSuccess({ alertaId })),
          catchError((error) =>
            of(AlertasActions.deleteAlertaFailure({ error: error.message })),
          ),
        );
      }),
    ),
  );

  deleteAlertasByConvocatoria$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertasActions.deleteAlertasByConvocatoria),
      withLatestFrom(this.store.select(selectToken)),
      switchMap(([{ convocatoriaId }, token]) => {
        if (!token)
          return of(
            AlertasActions.deleteAlertasByConvocatoriaSuccess({
              convocatoriaId,
            }),
          );
        return this.alertasService
          .deleteAlertasByConvocatoria(token, convocatoriaId)
          .pipe(
            map(() =>
              AlertasActions.deleteAlertasByConvocatoriaSuccess({
                convocatoriaId,
              }),
            ),
            catchError(() =>
              of(
                AlertasActions.deleteAlertasByConvocatoriaSuccess({
                  convocatoriaId,
                }),
              ),
            ),
          );
      }),
    ),
  );
}

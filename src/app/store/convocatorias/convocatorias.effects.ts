import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ConvocatoriasService } from '../../services/convocatorias.service';
import * as ConvocatoriasActions from './convocatorias.actions';

@Injectable()
export class ConvocatoriasEffects {
  private actions$ = inject(Actions);
  private convocatoriasService = inject(ConvocatoriasService);

  cargarConvocatorias$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConvocatoriasActions.cargarConvocatorias),
      switchMap(() =>
        this.convocatoriasService.getConvocatorias().pipe(
          map((convocatorias) =>
            ConvocatoriasActions.cargarConvocatoriasSuccess({ convocatorias }),
          ),
          catchError((error) =>
            of(
              ConvocatoriasActions.cargarConvocatoriasFailure({
                error: error.message || 'Error al cargar las convocatorias',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}

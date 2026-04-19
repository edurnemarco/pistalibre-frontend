import { createAction, props } from '@ngrx/store';
import { Alerta } from './alertas.state';

export const cargarAlertas = createAction('[Alertas] Cargar');

export const cargarAlertasSuccess = createAction(
  '[Alertas] Cargar Success',
  props<{ alertas: Alerta[] }>(),
);

export const cargarAlertasFailure = createAction(
  '[Alertas] Cargar Failure',
  props<{ error: string }>(),
);

export const createAlerta = createAction(
  '[Alertas] Create',
  props<{ convocatoriaId: string; diasAntes: number }>(),
);

export const createAlertaSuccess = createAction(
  '[Alertas] Create Success',
  props<{ alerta: Alerta }>(),
);

export const createAlertaFailure = createAction(
  '[Alertas] Create Failure',
  props<{ error: string }>(),
);

export const deleteAlerta = createAction(
  '[Alertas] Delete',
  props<{ alertaId: string }>(),
);

export const deleteAlertaSuccess = createAction(
  '[Alertas] Delete Success',
  props<{ alertaId: string }>(),
);

export const deleteAlertaFailure = createAction(
  '[Alertas] Delete Failure',
  props<{ error: string }>(),
);

export const deleteAlertasByConvocatoria = createAction(
  '[Alertas] Delete By Convocatoria',
  props<{ convocatoriaId: string }>(),
);

export const deleteAlertasByConvocatoriaSuccess = createAction(
  '[Alertas] Delete By Convocatoria Success',
  props<{ convocatoriaId: string }>(),
);

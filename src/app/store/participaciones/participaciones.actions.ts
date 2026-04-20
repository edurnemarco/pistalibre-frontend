import { createAction, props } from '@ngrx/store';
import { Participacion } from './participaciones.state';

export const cargarParticipaciones = createAction('[Participaciones] Cargar');

export const cargarParticipacionesSuccess = createAction(
  '[Participaciones] Cargar Success',
  props<{ participaciones: Participacion[] }>(),
);

export const cargarParticipacionesFailure = createAction(
  '[Participaciones] Cargar Failure',
  props<{ error: string }>(),
);

export const createParticipacion = createAction(
  '[Participaciones] Create',
  props<{ data: Partial<Participacion> }>(),
);

export const createParticipacionSuccess = createAction(
  '[Participaciones] Create Success',
  props<{ participacion: Participacion }>(),
);

export const createParticipacionFailure = createAction(
  '[Participaciones] Create Failure',
  props<{ error: string }>(),
);

export const updateParticipacion = createAction(
  '[Participaciones] Update',
  props<{ id: string; data: Partial<Participacion> }>(),
);

export const updateParticipacionSuccess = createAction(
  '[Participaciones] Update Success',
  props<{ participacion: Participacion }>(),
);

export const updateParticipacionFailure = createAction(
  '[Participaciones] Update Failure',
  props<{ error: string }>(),
);

export const deleteParticipacion = createAction(
  '[Participaciones] Delete',
  props<{ id: string }>(),
);

export const deleteParticipacionSuccess = createAction(
  '[Participaciones] Delete Success',
  props<{ id: string }>(),
);

export const deleteParticipacionFailure = createAction(
  '[Participaciones] Delete Failure',
  props<{ error: string }>(),
);

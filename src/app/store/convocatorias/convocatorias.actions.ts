import { createAction, props } from '@ngrx/store';
import { Convocatoria, FiltrosConvocatorias } from './convocatorias.state';

export const cargarConvocatorias = createAction('[Convocatorias] Cargar');

export const cargarConvocatoriasSuccess = createAction(
  '[Convocatorias] Cargar Success',
  props<{ convocatorias: Convocatoria[] }>(),
);

export const cargarConvocatoriasFailure = createAction(
  '[Convocatorias] Cargar Failure',
  props<{ error: string }>(),
);

export const actualizarFiltros = createAction(
  '[Convocatorias] Actualizar Filtros',
  props<{ filtros: Partial<FiltrosConvocatorias> }>(),
);

export const limpiarFiltros = createAction('[Convocatorias] Limpiar Filtros');

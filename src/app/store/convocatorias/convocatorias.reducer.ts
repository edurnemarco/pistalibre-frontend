import { createReducer, on } from '@ngrx/store';
import * as ConvocatoriasActions from './convocatorias.actions';
import {
  initialConvocatoriasState,
  initialFiltros,
} from './convocatorias.state';

export const convocatoriasReducer = createReducer(
  initialConvocatoriasState,

  on(ConvocatoriasActions.cargarConvocatorias, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    ConvocatoriasActions.cargarConvocatoriasSuccess,
    (state, { convocatorias }) => ({
      ...state,
      convocatorias,
      loading: false,
      error: null,
    }),
  ),

  on(ConvocatoriasActions.cargarConvocatoriasFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(ConvocatoriasActions.actualizarFiltros, (state, { filtros }) => ({
    ...state,
    filtros: { ...state.filtros, ...filtros },
  })),

  on(ConvocatoriasActions.limpiarFiltros, (state) => ({
    ...state,
    filtros: initialFiltros,
  })),
);

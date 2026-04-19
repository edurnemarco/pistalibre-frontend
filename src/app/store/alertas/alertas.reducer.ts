import { createReducer, on } from '@ngrx/store';
import * as AlertasActions from './alertas.actions';
import { initialAlertasState } from './alertas.state';

export const alertasReducer = createReducer(
  initialAlertasState,

  on(AlertasActions.cargarAlertas, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AlertasActions.cargarAlertasSuccess, (state, { alertas }) => ({
    ...state,
    alertas,
    loading: false,
    error: null,
  })),

  on(AlertasActions.cargarAlertasFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AlertasActions.createAlertaSuccess, (state, { alerta }) => ({
    ...state,
    alertas: [...state.alertas, alerta],
  })),

  on(AlertasActions.deleteAlertaSuccess, (state, { alertaId }) => ({
    ...state,
    alertas: state.alertas.filter((a) => a.id !== alertaId),
  })),

  on(
    AlertasActions.deleteAlertasByConvocatoriaSuccess,
    (state, { convocatoriaId }) => ({
      ...state,
      alertas: state.alertas.filter(
        (a) => a.convocatoria_id !== convocatoriaId,
      ),
    }),
  ),
);

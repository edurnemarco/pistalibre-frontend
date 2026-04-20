import { createReducer, on } from '@ngrx/store';
import * as ParticipacionesActions from './participaciones.actions';
import { initialParticipacionesState } from './participaciones.state';

export const participacionesReducer = createReducer(
  initialParticipacionesState,

  on(ParticipacionesActions.cargarParticipaciones, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    ParticipacionesActions.cargarParticipacionesSuccess,
    (state, { participaciones }) => ({
      ...state,
      participaciones,
      loading: false,
      error: null,
    }),
  ),

  on(
    ParticipacionesActions.cargarParticipacionesFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    }),
  ),

  on(
    ParticipacionesActions.createParticipacionSuccess,
    (state, { participacion }) => ({
      ...state,
      participaciones: [participacion, ...state.participaciones],
    }),
  ),

  on(
    ParticipacionesActions.updateParticipacionSuccess,
    (state, { participacion }) => ({
      ...state,
      participaciones: state.participaciones.map((p) =>
        p.id === participacion.id ? participacion : p,
      ),
    }),
  ),

  on(ParticipacionesActions.deleteParticipacionSuccess, (state, { id }) => ({
    ...state,
    participaciones: state.participaciones.filter((p) => p.id !== id),
  })),
);

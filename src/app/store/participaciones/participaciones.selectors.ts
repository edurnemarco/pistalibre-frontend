import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ParticipacionesState } from './participaciones.state';

export const selectParticipacionesState =
  createFeatureSelector<ParticipacionesState>('participaciones');

export const selectParticipaciones = createSelector(
  selectParticipacionesState,
  (state) => state.participaciones,
);

export const selectParticipacionesLoading = createSelector(
  selectParticipacionesState,
  (state) => state.loading,
);

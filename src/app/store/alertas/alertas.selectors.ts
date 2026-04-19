import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertasState } from './alertas.state';

export const selectAlertasState =
  createFeatureSelector<AlertasState>('alertas');

export const selectAlertas = createSelector(
  selectAlertasState,
  (state) => state.alertas,
);

export const selectAlertasLoading = createSelector(
  selectAlertasState,
  (state) => state.loading,
);

export const selectHasAlerta = (convocatoriaId: string) =>
  createSelector(selectAlertas, (alertas) =>
    alertas.some((a) => a.convocatoria_id === convocatoriaId),
  );

export const selectAlertaId = (convocatoriaId: string) =>
  createSelector(
    selectAlertas,
    (alertas) => alertas.find((a) => a.convocatoria_id === convocatoriaId)?.id,
  );

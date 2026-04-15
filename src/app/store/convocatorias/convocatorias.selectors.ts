import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConvocatoriasState } from './convocatorias.state';

export const selectConvocatoriasState =
  createFeatureSelector<ConvocatoriasState>('convocatorias');

export const selectTodasConvocatorias = createSelector(
  selectConvocatoriasState,
  (state) => state.convocatorias,
);

export const selectConvocatoriasLoading = createSelector(
  selectConvocatoriasState,
  (state) => state.loading,
);

export const selectConvocatoriasError = createSelector(
  selectConvocatoriasState,
  (state) => state.error,
);

export const selectFiltros = createSelector(
  selectConvocatoriasState,
  (state) => state.filtros,
);

export const selectConvocatoriasFiltradas = createSelector(
  selectTodasConvocatorias,
  selectFiltros,
  (convocatorias, filtros) => {
    return convocatorias.filter((c) => {
      if (filtros.disciplinas.length > 0) {
        const match = filtros.disciplinas.some((d) =>
          c.disciplinas.includes(d),
        );
        if (!match) return false;
      }

      if (filtros.tipos.length > 0) {
        if (!filtros.tipos.includes(c.tipo)) return false;
      }

      if (filtros.ciudad) {
        if (!c.ciudad.toLowerCase().includes(filtros.ciudad.toLowerCase()))
          return false;
      }

      if (filtros.region) {
        if (!c.region.toLowerCase().includes(filtros.region.toLowerCase()))
          return false;
      }

      if (filtros.estado) {
        const hoy = new Date();
        const fechaLimite = new Date(c.fecha_limite);
        if (filtros.estado === 'abierta' && fechaLimite < hoy) return false;
        if (filtros.estado === 'cerrada' && fechaLimite >= hoy) return false;
        if (filtros.estado === 'próximamente') {
          const diasRestantes =
            (fechaLimite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
          if (diasRestantes > 30 || diasRestantes < 0) return false;
        }
      }

      return true;
    });
  },
);

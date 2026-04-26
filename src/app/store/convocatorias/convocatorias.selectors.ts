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
    let filtradas = convocatorias.filter((c) => {
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
        if (
          !c.ciudad.toLowerCase().includes(filtros.ciudad.toLowerCase()) &&
          !c.region.toLowerCase().includes(filtros.ciudad.toLowerCase())
        )
          return false;
      }

      if (filtros.estado) {
        const hoy = new Date();
        const fechaLimite = new Date(c.fecha_limite);
        const diasRestantes =
          (fechaLimite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
        if (filtros.estado === 'abierta' && diasRestantes < 0) return false;
        if (filtros.estado === 'cerrada' && diasRestantes >= 0) return false;
        if (
          filtros.estado === 'próximamente' &&
          (diasRestantes > 30 || diasRestantes < 0)
        )
          return false;
      }

      if (filtros.mes) {
        const mesNum = parseInt(filtros.mes);
        if (new Date(c.fecha_limite).getMonth() + 1 !== mesNum) return false;
      }

      if (filtros.anio) {
        if (new Date(c.fecha_limite).getFullYear().toString() !== filtros.anio)
          return false;
      }

      if (filtros.dia) {
        if (new Date(c.fecha_limite).getDate().toString() !== filtros.dia)
          return false;
      }

      return true;
    });

    // Ordenar: abiertas primero por fecha más cercana, cerradas al final
    const hoy = new Date();
    const abiertas = filtradas
      .filter((c) => new Date(c.fecha_limite) >= hoy)
      .sort(
        (a, b) =>
          new Date(a.fecha_limite).getTime() -
          new Date(b.fecha_limite).getTime(),
      );
    const cerradas = filtradas
      .filter((c) => new Date(c.fecha_limite) < hoy)
      .sort(
        (a, b) =>
          new Date(b.fecha_limite).getTime() -
          new Date(a.fecha_limite).getTime(),
      );

    return [...abiertas, ...cerradas];
  },
);

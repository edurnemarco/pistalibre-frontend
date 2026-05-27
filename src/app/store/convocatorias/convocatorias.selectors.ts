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
        const ciudad = c.ciudad?.toLowerCase() || '';
        const region = c.region?.toLowerCase() || '';
        const busqueda = filtros.ciudad.toLowerCase();
        if (!ciudad.includes(busqueda) && !region.includes(busqueda))
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
      if (filtros.mes || filtros.anio || filtros.dia) {
        const hoy = new Date();
        const anio = filtros.anio ? parseInt(filtros.anio) : null;
        const mesNum = filtros.mes ? parseInt(filtros.mes) : null;
        const diaNum = filtros.dia ? parseInt(filtros.dia) : null;

        // Calcular fecha límite máxima según los filtros aplicados
        let fechaMaxima: Date;

        if (mesNum && diaNum) {
          // Día + mes (+ año opcional)
          const anioFinal = anio || new Date().getFullYear();
          fechaMaxima = new Date(anioFinal, mesNum - 1, diaNum, 23, 59, 59);
        } else if (mesNum) {
          // Solo mes (+ año opcional)
          const anioFinal = anio || new Date().getFullYear();
          fechaMaxima = new Date(anioFinal, mesNum, 0, 23, 59, 59); // último día del mes
        } else if (anio) {
          // Solo año
          fechaMaxima = new Date(anio, 11, 31, 23, 59, 59);
        } else {
          fechaMaxima = new Date(9999, 11, 31);
        }

        const fechaConv = new Date(c.fecha_limite);
        if (fechaConv > fechaMaxima || fechaConv < hoy) return false;
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

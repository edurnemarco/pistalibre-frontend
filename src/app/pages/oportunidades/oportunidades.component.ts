import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import {
  actualizarFiltros,
  cargarConvocatorias,
  limpiarFiltros,
} from '../../store/convocatorias/convocatorias.actions';
import {
  selectConvocatoriasFiltradas,
  selectConvocatoriasLoading,
  selectFiltros,
  selectTodasConvocatorias,
} from '../../store/convocatorias/convocatorias.selectors';
import {
  Convocatoria,
  FiltrosConvocatorias,
} from '../../store/convocatorias/convocatorias.state';

import { take } from 'rxjs/operators';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import {
  ConvocatoriasService,
  ParticipantePublico,
} from '../../services/convocatorias.service';
import { selectUserTipo } from '../../store/auth/auth.selectors';
import {
  addFavorito,
  cargarFavoritos,
  deleteFavorito,
} from '../../store/favoritos/favoritos.actions';
import {
  selectFavoritoId,
  selectIsFavorito,
} from '../../store/favoritos/favoritos.selectors';

@Component({
  selector: 'app-oportunidades',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    ScrollRevealDirective,
  ],
  templateUrl: './oportunidades.component.html',
  styleUrl: './oportunidades.component.scss',
})
export class OportunidadesComponent implements OnInit {
  convocatorias$: Observable<Convocatoria[]>;
  convocatoriasPaginadas$: Observable<Convocatoria[]>;
  totalPaginas$: Observable<number>;
  paginas$: Observable<number[]>;
  loading$: Observable<boolean>;
  filtros$: Observable<FiltrosConvocatorias>;
  isAuthenticated$: Observable<boolean>;
  filtrosAbiertos = false;
  convocatoriasPorPagina = 10;
  paginaActual$ = new BehaviorSubject<number>(1);

  disciplinasOpciones = [
    'pintura',
    'ilustración',
    'escultura',
    'fotografía',
    'videoarte',
    'cine',
    'danza',
    'artes escénicas',
    'música',
    'gestión cultural',
    'investigación',
    'instalación',
    'grabado',
    'diseño',
    'escritura',
    'multidisciplinar',
    'arquitectura',
  ].sort((a, b) => a.localeCompare(b, 'es'));

  tiposOpciones = ['ayuda', 'beca', 'concurso', 'premio', 'residencia'];
  estadosOpciones = ['abierta', 'cerrada'];
  convocatoriasExpandidas = new Set<string>();
  aniosOpciones$: Observable<string[]>;
  mesesOpciones$: Observable<{ valor: string; label: string }[]>;
  mesSeleccionado = '';
  anioSeleccionado = '';
  participantesMap: Record<string, ParticipantePublico[]> = {};
  participantesLoading: Record<string, boolean> = {};
  userTipo$: Observable<string | undefined>;
  mesAbierto = false;
  anioAbierto = false;
  paginaVersion = 0;
  constructor(
    private store: Store,
    private convocatoriasService: ConvocatoriasService,
  ) {
    this.convocatorias$ = this.store.select(selectConvocatoriasFiltradas);
    this.loading$ = this.store.select(selectConvocatoriasLoading);
    this.filtros$ = this.store.select(selectFiltros);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.userTipo$ = this.store.select(selectUserTipo);
    this.convocatoriasPaginadas$ = combineLatest([
      this.convocatorias$,
      this.paginaActual$,
    ]).pipe(
      map(([convocatorias, pagina]) => {
        const inicio = (pagina - 1) * this.convocatoriasPorPagina;
        return convocatorias.slice(
          inicio,
          inicio + this.convocatoriasPorPagina,
        );
      }),
    );

    this.totalPaginas$ = this.convocatorias$.pipe(
      map((convocatorias) =>
        Math.ceil(convocatorias.length / this.convocatoriasPorPagina),
      ),
    );

    this.paginas$ = this.totalPaginas$.pipe(
      map((total) => Array.from({ length: total }, (_, i) => i + 1)),
    );

    this.mesesOpciones$ = this.store.select(selectTodasConvocatorias).pipe(
      map((convocatorias) => {
        const mesesNombres = [
          'enero',
          'febrero',
          'marzo',
          'abril',
          'mayo',
          'junio',
          'julio',
          'agosto',
          'septiembre',
          'octubre',
          'noviembre',
          'diciembre',
        ];
        return convocatorias
          .map((c) => new Date(c.fecha_limite).getMonth() + 1)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort((a, b) => a - b)
          .map((m) => ({ valor: m.toString(), label: mesesNombres[m - 1] }));
      }),
    );

    this.aniosOpciones$ = this.store.select(selectTodasConvocatorias).pipe(
      map((convocatorias) => {
        return convocatorias
          .map((c) => new Date(c.fecha_limite).getFullYear().toString())
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort();
      }),
    );
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.filtros-fondo') &&
      !target.closest('.btn-ver-mas') &&
      !target.closest('.btn-guardar') &&
      !target.closest('.conv-titulo-link') &&
      !target.closest('.institucion-link')
    ) {
      this.filtrosAbiertos = false;
    }
  }

  ngOnInit() {
    this.store.dispatch(cargarFavoritos());
    this.store.dispatch(cargarConvocatorias());
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
    if (!this.filtrosAbiertos) {
      (document.activeElement as HTMLElement)?.blur();
    }
  }

  toggleDisciplina(disciplina: string, filtrosActuales: FiltrosConvocatorias) {
    const disciplinas = filtrosActuales.disciplinas.includes(disciplina)
      ? filtrosActuales.disciplinas.filter((d) => d !== disciplina)
      : [...filtrosActuales.disciplinas, disciplina];
    this.store.dispatch(actualizarFiltros({ filtros: { disciplinas } }));
    this.paginaActual$.next(1);
  }

  toggleTipo(tipo: string, filtrosActuales: FiltrosConvocatorias) {
    const tipos = filtrosActuales.tipos.includes(tipo)
      ? filtrosActuales.tipos.filter((t) => t !== tipo)
      : [...filtrosActuales.tipos, tipo];
    this.store.dispatch(actualizarFiltros({ filtros: { tipos } }));
    this.paginaActual$.next(1);
  }

  setEstado(estado: string, filtrosActuales: FiltrosConvocatorias) {
    const nuevoEstado = filtrosActuales.estado === estado ? '' : estado;
    this.store.dispatch(
      actualizarFiltros({ filtros: { estado: nuevoEstado } }),
    );
    this.paginaActual$.next(1);
  }

  onCiudadChange(event: Event) {
    const ciudad = (event.target as HTMLInputElement).value;
    this.store.dispatch(actualizarFiltros({ filtros: { ciudad } }));
    this.paginaActual$.next(1);
  }

  onMesChange(valor: string) {
    this.store.dispatch(actualizarFiltros({ filtros: { mes: valor } }));
    this.paginaActual$.next(1);
  }
  onAnioChange(valor: string) {
    this.store.dispatch(actualizarFiltros({ filtros: { anio: valor } }));
    this.paginaActual$.next(1);
  }

  limpiarFiltros() {
    this.store.dispatch(limpiarFiltros());
    this.paginaActual$.next(1);
  }
  irAPagina(pagina: number) {
    this.paginaVersion++;
    this.paginaActual$.next(pagina);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
  }

  toggleExpansion(id: string) {
    if (this.convocatoriasExpandidas.has(id)) {
      this.convocatoriasExpandidas.delete(id);
    } else {
      this.convocatoriasExpandidas.add(id);
      this.loadParticipantes(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.convocatoriasExpandidas.has(id);
  }

  isFavorito(convocatoriaId: string): Observable<boolean> {
    return this.store.select(selectIsFavorito(convocatoriaId));
  }

  toggleFavorito(convocatoriaId: string) {
    this.store
      .select(selectFavoritoId(convocatoriaId))
      .pipe(take(1))
      .subscribe((favoritoId) => {
        if (favoritoId) {
          this.store.dispatch(deleteFavorito({ favoritoId }));
        } else {
          this.store.dispatch(addFavorito({ convocatoriaId }));
        }
      });
  }

  diasRestantes(fechaLimite: string): number {
    const hoy = new Date();
    const fecha = new Date(fechaLimite);
    return Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onCheckboxFocus(event: FocusEvent) {
    const target = event.target as HTMLElement;
    target.parentElement?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }

  loadParticipantes(convocatoriaId: string): void {
    if (this.participantesMap[convocatoriaId] !== undefined) return;
    this.participantesLoading[convocatoriaId] = true;
    this.convocatoriasService.getParticipantes(convocatoriaId).subscribe({
      next: (data) => {
        this.participantesMap[convocatoriaId] = data;
        this.participantesLoading[convocatoriaId] = false;
      },
      error: () => {
        this.participantesMap[convocatoriaId] = [];
        this.participantesLoading[convocatoriaId] = false;
      },
    });
  }

  trackByConvocatoria(index: number, c: Convocatoria): string {
    return c.id + '_' + this.paginaVersion;
  }

  getParticipantes(id: string): ParticipantePublico[] {
    return this.participantesMap[id] || [];
  }

  getParticipantesTexto(
    id: string,
  ): { nombre: string; anio: number; usuarioId: string | null }[] {
    return (this.participantesMap[id] || []).map((p) => ({
      nombre: p.usuario
        ? `${p.usuario.nombre} ${p.usuario.apellidos}`.trim()
        : 'Participante',
      anio: p.año,
      usuarioId: p.usuario?.id || null,
    }));
  }

  dotacionCorta(conv: any): string | null {
    const detalle = conv.beneficios?.dotacion_detalle;
    if (!detalle) return null;
    if (detalle.length <= 300) return detalle;
    return null;
  }

  dotacionLarga(conv: any): string | null {
    const detalle = conv.beneficios?.dotacion_detalle;
    if (!detalle) return null;
    if (detalle.length > 300) return detalle;
    return null;
  }
}

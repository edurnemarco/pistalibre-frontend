import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
} from '../../store/convocatorias/convocatorias.selectors';
import {
  Convocatoria,
  FiltrosConvocatorias,
} from '../../store/convocatorias/convocatorias.state';

@Component({
  selector: 'app-oportunidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
    'escultura',
    'fotografía',
    'videoarte',
    'instalación',
    'grabado',
    'diseño',
    'escritura',
    'multidisciplinar',
  ];

  tiposOpciones = ['convocatoria', 'residencia', 'beca', 'concurso'];
  estadosOpciones = ['abierta', 'próximamente', 'cerrada'];
  convocatoriasExpandidas = new Set<string>();

  constructor(private store: Store) {
    this.convocatorias$ = this.store.select(selectConvocatoriasFiltradas);
    this.loading$ = this.store.select(selectConvocatoriasLoading);
    this.filtros$ = this.store.select(selectFiltros);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);

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
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.filtros-fondo')) {
      this.filtrosAbiertos = false;
    }
  }

  ngOnInit() {
    this.store.dispatch(cargarConvocatorias());
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
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

  limpiarFiltros() {
    this.store.dispatch(limpiarFiltros());
    this.paginaActual$.next(1);
  }

  irAPagina(pagina: number) {
    this.paginaActual$.next(pagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleExpansion(id: string) {
    if (this.convocatoriasExpandidas.has(id)) {
      this.convocatoriasExpandidas.delete(id);
    } else {
      this.convocatoriasExpandidas.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.convocatoriasExpandidas.has(id);
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
}

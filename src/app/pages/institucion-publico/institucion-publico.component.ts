import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  cargarAlertas,
  createAlerta,
  deleteAlertasByConvocatoria,
} from '../../store/alertas/alertas.actions';
import {
  selectAlertas,
  selectHasAlerta,
} from '../../store/alertas/alertas.selectors';
import {
  selectIsAuthenticated,
  selectUserTipo,
} from '../../store/auth/auth.selectors';
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
  selector: 'app-institucion-publico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './institucion-publico.component.html',
  styleUrl: './institucion-publico.component.scss',
})
export class InstitucionPublicoComponent implements OnInit {
  private apiUrl = environment.apiUrl;

  institucion: any = null;
  loading = true;
  error = false;

  isAuthenticated$: Observable<boolean>;
  userTipo$: Observable<string | undefined>;

  // Modal alerta
  modalAlertaAbierto = false;
  convocatoriaSeleccionada: any = null;
  esAlertaInstitucion = false;
  diasSeleccionados: number[] = [];
  alertaExistente = false;
  opcionesAlerta = [1, 3, 7, 14, 30];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private store: Store,
  ) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.userTipo$ = this.store.select(selectUserTipo);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.http.get<any>(`${this.apiUrl}/instituciones/${id}`).subscribe({
      next: (data) => {
        this.institucion = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });

    this.store.dispatch(cargarFavoritos());
    this.store.dispatch(cargarAlertas());
  }

  get convocatoriasAbiertas(): any[] {
    if (!this.institucion?.convocatorias) return [];
    const hoy = new Date();
    return this.institucion.convocatorias
      .filter(
        (c: any) => c.estado === 'publicada' && new Date(c.fecha_limite) >= hoy,
      )
      .sort(
        (a: any, b: any) =>
          new Date(a.fecha_limite).getTime() -
          new Date(b.fecha_limite).getTime(),
      );
  }

  get convocatoriasCerradas(): any[] {
    if (!this.institucion?.convocatorias) return [];
    const hoy = new Date();
    return this.institucion.convocatorias
      .filter(
        (c: any) => c.estado === 'publicada' && new Date(c.fecha_limite) < hoy,
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.fecha_limite).getTime() -
          new Date(a.fecha_limite).getTime(),
      );
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  diasRestantes(fechaLimite: string): number {
    const hoy = new Date();
    const fecha = new Date(fechaLimite);
    return Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
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

  hasAlerta(convocatoriaId: string): Observable<boolean> {
    return this.store.select(selectHasAlerta(convocatoriaId));
  }

  abrirModalAlerta(conv: any) {
    this.convocatoriaSeleccionada = conv;
    this.esAlertaInstitucion = false;
    this.diasSeleccionados = [];
    this.store
      .select(selectAlertas)
      .pipe(take(1))
      .subscribe((alertas) => {
        const existentes = alertas.filter((a) => a.convocatoria_id === conv.id);
        if (existentes.length > 0) {
          this.alertaExistente = true;
          this.diasSeleccionados = existentes.map((a) => a.dias_antes);
        } else {
          this.alertaExistente = false;
        }
      });
    this.modalAlertaAbierto = true;
  }

  abrirModalAlertaInstitucion() {
    this.convocatoriaSeleccionada = null;
    this.esAlertaInstitucion = true;
    this.diasSeleccionados = [];
    this.alertaExistente = false;
    this.modalAlertaAbierto = true;
  }

  cerrarModal() {
    this.modalAlertaAbierto = false;
    this.convocatoriaSeleccionada = null;
    this.esAlertaInstitucion = false;
    this.diasSeleccionados = [];
  }

  toggleDiasAlerta(dias: number) {
    if (this.diasSeleccionados.includes(dias)) {
      this.diasSeleccionados = this.diasSeleccionados.filter((d) => d !== dias);
    } else {
      this.diasSeleccionados = [...this.diasSeleccionados, dias];
    }
  }

  confirmarAlerta() {
    if (this.diasSeleccionados.length === 0) return;

    if (this.esAlertaInstitucion) {
      // Crear alertas para todas las convocatorias abiertas de la institución
      this.convocatoriasAbiertas.forEach((conv, convIndex) => {
        setTimeout(() => {
          this.store.dispatch(
            deleteAlertasByConvocatoria({ convocatoriaId: conv.id }),
          );
          setTimeout(() => {
            this.diasSeleccionados.forEach((dias, diaIndex) => {
              setTimeout(() => {
                this.store.dispatch(
                  createAlerta({ convocatoriaId: conv.id, diasAntes: dias }),
                );
              }, diaIndex * 300);
            });
          }, 500);
        }, convIndex * 800);
      });
    } else {
      // Alerta de una convocatoria específica
      const convocatoriaId = this.convocatoriaSeleccionada.id;
      this.store.dispatch(deleteAlertasByConvocatoria({ convocatoriaId }));
      setTimeout(() => {
        this.diasSeleccionados.forEach((dias, index) => {
          setTimeout(() => {
            this.store.dispatch(
              createAlerta({ convocatoriaId, diasAntes: dias }),
            );
          }, index * 300);
        });
      }, 500);
    }

    this.cerrarModal();
  }
}

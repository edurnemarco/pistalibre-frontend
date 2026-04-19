import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { CloudinaryService } from '../../services/cloudinary.service';
import { PerfilService } from '../../services/perfil.service';
import {
  cargarAlertas,
  createAlerta,
  deleteAlertasByConvocatoria,
} from '../../store/alertas/alertas.actions';
import {
  selectAlertas,
  selectAlertasLoading,
  selectHasAlerta,
} from '../../store/alertas/alertas.selectors';
import { updateUserSuccess } from '../../store/auth/auth.actions';
import { selectToken, selectUser } from '../../store/auth/auth.selectors';
import { User } from '../../store/auth/auth.state';
import {
  cargarFavoritos,
  deleteFavorito,
} from '../../store/favoritos/favoritos.actions';
import {
  selectFavoritos,
  selectFavoritosLoading,
} from '../../store/favoritos/favoritos.selectors';
import { Favorito } from '../../store/favoritos/favoritos.state';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  // Observables del store
  user$: Observable<User | null>;
  token$: Observable<string | null>;

  // Estado de la UI
  tabActiva: 'perfil' | 'favoritos' | 'alertas' | 'participaciones' = 'perfil';
  editando = false;
  guardando = false;
  mensajeExito = '';
  subiendoAvatar = false;
  avatarUrl: string | null = null;
  avatarPreview: string | null = null;

  // Formulario
  form: FormGroup;

  // Disciplinas
  disciplinasOpciones = [
    'artes escénicas',
    'cine',
    'danza',
    'diseño',
    'escritura',
    'escultura',
    'fotografía',
    'gestión cultural',
    'grabado',
    'ilustración',
    'instalación',
    'investigación',
    'multidisciplinar',
    'música',
    'pintura',
    'videoarte',
  ];

  disciplinasSeleccionadas: string[] = [];
  disciplinasAbiertas = false;

  // Favoritos
  favoritos$: Observable<Favorito[]>;
  favoritosLoading$: Observable<boolean>;
  tieneFavoritosUrgentes$: Observable<boolean>;

  // Alertas
  alertas$: Observable<any[]>;
  alertasLoading$: Observable<boolean>;
  modalAlertaAbierto = false;
  favoritoSeleccionado: Favorito | null = null;
  diasSeleccionados: number[] = [];
  alertaExistente = false;
  opcionesAlerta = [1, 3, 7, 14, 30];
  modalConfirmacion: 'favorito' | 'alerta' | null = null;
  itemAEliminar: string | null = null;
  procesandoAlertas = false;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private cloudinaryService: CloudinaryService,
  ) {
    this.user$ = this.store.select(selectUser);
    this.token$ = this.store.select(selectToken);

    this.form = this.fb.group({
      nombre: [''],
      apellidos: [''],
      bio: [''],
      ciudad: [''],
      region: [''],
      pais: [''],
      web: [''],
      redes: [''],
    });
    this.favoritos$ = this.store.select(selectFavoritos);
    this.favoritosLoading$ = this.store.select(selectFavoritosLoading);

    this.alertas$ = this.store.select(selectAlertas);
    this.alertasLoading$ = this.store.select(selectAlertasLoading);
    this.tieneFavoritosUrgentes$ = this.favoritos$.pipe(
      map((favoritos) => {
        const hoy = new Date();
        return favoritos.some((f) => {
          if (!f.convocatoria) return false;
          const dias = Math.ceil(
            (new Date(f.convocatoria.fecha_limite).getTime() - hoy.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return dias >= 0 && dias <= 7;
        });
      }),
    );
  }

  ngOnInit() {
    this.token$
      .pipe(
        take(1),
        filter((token) => !!token),
      )
      .subscribe(() => {
        this.store.dispatch(cargarFavoritos());
      });

    this.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.avatarUrl = (user as any).avatar_url || null;
        this.form.patchValue({
          nombre: user.nombre,
          apellidos: (user as any).apellidos || '',
          bio: user.bio || '',
          ciudad: user.ciudad || '',
          region: user.region || '',
          pais: user.pais || '',
          web: user.web || '',
          redes: user.redes || '',
        });
        const disciplinas = (user as any).disciplinas;
        if (Array.isArray(disciplinas)) {
          this.disciplinasSeleccionadas = disciplinas;
        } else if (typeof disciplinas === 'string' && disciplinas) {
          this.disciplinasSeleccionadas = [disciplinas];
        } else {
          this.disciplinasSeleccionadas = [];
        }
      }
    });
    this.store.dispatch(cargarAlertas());
  }

  // Tabs
  setTab(tab: 'perfil' | 'favoritos' | 'alertas' | 'participaciones') {
    this.tabActiva = tab;
  }

  // Edición
  toggleEditar() {
    this.editando = !this.editando;
    this.mensajeExito = '';
    if (!this.editando) {
      this.avatarPreview = null;
    }
  }

  // Helpers
  getApellidos(user: User): string {
    return (user as any).apellidos || '';
  }

  // Disciplinas
  toggleDisciplina(d: string) {
    if (this.disciplinasSeleccionadas.includes(d)) {
      this.disciplinasSeleccionadas = this.disciplinasSeleccionadas.filter(
        (x) => x !== d,
      );
    } else {
      this.disciplinasSeleccionadas = [...this.disciplinasSeleccionadas, d];
    }
  }

  toggleDisciplinas() {
    this.disciplinasAbiertas = !this.disciplinasAbiertas;
  }

  isDisciplinaSelected(d: string): boolean {
    return this.disciplinasSeleccionadas.includes(d);
  }

  // Guardar perfil
  guardarPerfil() {
    this.guardando = true;
    this.token$.pipe(take(1)).subscribe((token) => {
      if (!token) return;
      const data: any = {
        ...this.form.value,
        disciplinas: this.disciplinasSeleccionadas,
      };
      if (this.avatarPreview) {
        data.avatar_url = this.avatarPreview;
      }
      this.perfilService.updatePerfil(token, data).subscribe({
        next: (user) => {
          this.guardando = false;
          this.editando = false;
          this.avatarUrl = this.avatarPreview || this.avatarUrl;
          this.avatarPreview = null;
          this.mensajeExito = 'Perfil actualizado correctamente';
          this.store.dispatch(updateUserSuccess({ user }));
          setTimeout(() => {
            this.mensajeExito = '';
          }, 3000);
        },
        error: () => {
          this.guardando = false;
        },
      });
    });
  }

  // Avatar
  onAvatarClick() {
    if (!this.editando) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      this.subiendoAvatar = true;
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url) => {
          this.avatarPreview = url;
          this.subiendoAvatar = false;
        },
        error: () => {
          this.subiendoAvatar = false;
        },
      });
    };
    input.click();
  }

  // Favoritos

  eliminarFavorito(favoritoId: string) {
    this.store.dispatch(deleteFavorito({ favoritoId }));
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

  get favoritosOrdenados$(): Observable<Favorito[]> {
    return this.favoritos$.pipe(
      map((favoritos) => {
        const hoy = new Date();
        const abiertas = favoritos
          .filter((f) => new Date(f.convocatoria.fecha_limite) >= hoy)
          .sort(
            (a, b) =>
              new Date(a.convocatoria.fecha_limite).getTime() -
              new Date(b.convocatoria.fecha_limite).getTime(),
          );
        const cerradas = favoritos
          .filter((f) => new Date(f.convocatoria.fecha_limite) < hoy)
          .sort(
            (a, b) =>
              new Date(b.convocatoria.fecha_limite).getTime() -
              new Date(a.convocatoria.fecha_limite).getTime(),
          );
        return [...abiertas, ...cerradas];
      }),
    );
  }

  // Alertas

  activarAlerta(favorito: Favorito) {
    this.favoritoSeleccionado = favorito;
    this.diasSeleccionados = [];

    this.store
      .select(selectAlertas)
      .pipe(take(1))
      .subscribe((alertas) => {
        const alertasConvocatoria = alertas.filter(
          (a) => a.convocatoria_id === favorito.convocatoria_id,
        );
        if (alertasConvocatoria.length > 0) {
          this.alertaExistente = true;
          this.diasSeleccionados = alertasConvocatoria.map((a) => a.dias_antes);
        } else {
          this.alertaExistente = false;
        }
      });

    this.modalAlertaAbierto = true;
  }

  cerrarModal() {
    this.modalAlertaAbierto = false;
    this.favoritoSeleccionado = null;
    this.diasSeleccionados = [];
    this.alertaExistente = false;
  }

  toggleDiasAlerta(dias: number) {
    if (this.diasSeleccionados.includes(dias)) {
      this.diasSeleccionados = this.diasSeleccionados.filter((d) => d !== dias);
    } else {
      this.diasSeleccionados = [...this.diasSeleccionados, dias];
    }
  }

  ordenarDias(dias: number[]): number[] {
    return [...dias].sort((a, b) => b - a);
  }

  confirmarAlerta() {
    if (!this.favoritoSeleccionado || this.diasSeleccionados.length === 0)
      return;

    const convocatoriaId = this.favoritoSeleccionado.convocatoria_id;
    const diasACrear = [...this.diasSeleccionados];

    this.procesandoAlertas = true;
    this.store.dispatch(deleteAlertasByConvocatoria({ convocatoriaId }));

    setTimeout(() => {
      diasACrear.forEach((dias, index) => {
        setTimeout(() => {
          this.store.dispatch(
            createAlerta({ convocatoriaId, diasAntes: dias }),
          );
          if (index === diasACrear.length - 1) {
            setTimeout(() => {
              this.procesandoAlertas = false;
            }, 300);
          }
        }, index * 300);
      });
    }, 500);

    this.cerrarModal();
  }

  hasAlerta(convocatoriaId: string): Observable<boolean> {
    return this.store.select(selectHasAlerta(convocatoriaId));
  }

  get alertasPorConvocatoria$(): Observable<any[]> {
    return this.alertas$.pipe(
      map((alertas) => {
        const grupos = new Map<string, any>();
        alertas.forEach((a) => {
          if (!grupos.has(a.convocatoria_id)) {
            grupos.set(a.convocatoria_id, {
              convocatoriaId: a.convocatoria_id,
              titulo: a.convocatoria.titulo,
              ciudad: a.convocatoria.ciudad,
              region: a.convocatoria.region,
              fechaLimite: a.convocatoria.fecha_limite,
              diasAntes: [a.dias_antes],
              alertaIds: [a.id],
            });
          } else {
            const grupo = grupos.get(a.convocatoria_id);
            grupo.diasAntes.push(a.dias_antes);
            grupo.alertaIds.push(a.id);
          }
        });
        return Array.from(grupos.values()).sort(
          (a, b) =>
            new Date(a.fechaLimite).getTime() -
            new Date(b.fechaLimite).getTime(),
        );
      }),
    );
  }

  editarAlertaGrupo(grupo: any) {
    const favorito = {
      convocatoria_id: grupo.convocatoriaId,
      convocatoria: {
        titulo: grupo.titulo,
        ciudad: grupo.ciudad,
        region: grupo.region,
        fecha_limite: grupo.fechaLimite,
      },
    } as Favorito;
    this.favoritoSeleccionado = favorito;
    this.diasSeleccionados = [...grupo.diasAntes];
    this.alertaExistente = true;
    this.modalAlertaAbierto = true;
  }

  abrirConfirmacion(tipo: 'favorito' | 'alerta', id: string) {
    this.modalConfirmacion = tipo;
    this.itemAEliminar = id;
  }

  confirmarEliminacion() {
    if (!this.itemAEliminar) return;
    if (this.modalConfirmacion === 'favorito') {
      this.store.dispatch(deleteFavorito({ favoritoId: this.itemAEliminar }));
    } else if (this.modalConfirmacion === 'alerta') {
      this.store.dispatch(
        deleteAlertasByConvocatoria({ convocatoriaId: this.itemAEliminar }),
      );
    }
    this.cerrarConfirmacion();
  }

  cerrarConfirmacion() {
    this.modalConfirmacion = null;
    this.itemAEliminar = null;
  }

  trackByAlerta(index: number, grupo: any): string {
    return grupo.convocatoriaId;
  }

  trackByFavorito(index: number, favorito: Favorito): string {
    return favorito.id;
  }
}

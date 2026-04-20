import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { selectTodasConvocatorias } from '../../store/convocatorias/convocatorias.selectors';
import {
  cargarFavoritos,
  deleteFavorito,
} from '../../store/favoritos/favoritos.actions';
import {
  selectFavoritos,
  selectFavoritosLoading,
} from '../../store/favoritos/favoritos.selectors';
import { Favorito } from '../../store/favoritos/favoritos.state';
import {
  cargarParticipaciones,
  createParticipacion,
  deleteParticipacion,
  updateParticipacion,
} from '../../store/participaciones/participaciones.actions';
import {
  selectParticipaciones,
  selectParticipacionesLoading,
} from '../../store/participaciones/participaciones.selectors';
import { Participacion } from '../../store/participaciones/participaciones.state';
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

  // Formulario perfil
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
  modalConfirmacion: 'favorito' | 'alerta' | 'participacion' | null = null;
  itemAEliminar: string | null = null;
  procesandoAlertas = false;

  // Participaciones
  participaciones$: Observable<Participacion[]>;
  participacionesLoading$: Observable<boolean>;
  formularioParticipacion = false;
  participacionEditando: Participacion | null = null;
  formParticipacion: FormGroup;

  resultadosOpciones = [
    'pendiente',
    'seleccionado',
    'finalista',
    'no seleccionado',
  ];
  enlaces: string[] = [];
  nuevoEnlace = '';
  subiendoImagenParticipacion = false;
  participacionesExpandidas = new Set<string>();
  convocatoriasOpciones: any[] = [];
  convocatoriasFiltradas: any[] = [];
  mostrarSugerencias = false;
  imagenesParticipacion: string[] = [];
  imagenHover: string | null = null;
  imagenExpandida: string | null = null;
  maxImagenes = 5;

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

    this.alertas$ = this.store.select(selectAlertas);
    this.alertasLoading$ = this.store.select(selectAlertasLoading);

    this.participaciones$ = this.store.select(selectParticipaciones);
    this.participacionesLoading$ = this.store.select(
      selectParticipacionesLoading,
    );

    this.formParticipacion = this.fb.group({
      nombre_proyecto: ['', Validators.required],
      convocatoria_nombre: ['', Validators.required],
      convocatoria_id: [''],
      institucion_nombre: ['', Validators.required],
      lugar: ['', Validators.required],
      descripcion_proyecto: ['', Validators.required],
      resultado: ['', Validators.required],
      anio: ['', Validators.required],
      imagen_url: [''],
    });
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
    this.store.dispatch(cargarParticipaciones());
  }

  // Tabs
  setTab(tab: 'perfil' | 'favoritos' | 'alertas' | 'participaciones') {
    this.tabActiva = tab;
  }

  // Edición perfil
  toggleEditar() {
    this.editando = !this.editando;
    this.mensajeExito = '';
    if (!this.editando) {
      this.avatarPreview = null;
    }
  }

  getApellidos(user: User): string {
    return (user as any).apellidos || '';
  }

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

  // Confirmación eliminación
  abrirConfirmacion(tipo: 'favorito' | 'alerta' | 'participacion', id: string) {
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
    } else if (this.modalConfirmacion === 'participacion') {
      this.store.dispatch(deleteParticipacion({ id: this.itemAEliminar }));
    }
    this.cerrarConfirmacion();
  }

  cerrarConfirmacion() {
    this.modalConfirmacion = null;
    this.itemAEliminar = null;
  }

  // Participaciones
  abrirFormularioParticipacion(participacion?: Participacion) {
    this.formularioParticipacion = true;
    this.participacionEditando = participacion || null;
    this.imagenesParticipacion = [];
    this.enlaces = [];

    if (participacion) {
      this.formParticipacion.patchValue({
        nombre_proyecto: participacion.nombre_proyecto || '',
        convocatoria_nombre:
          participacion.convocatoria?.titulo ||
          participacion['convocatoria_nombre'] ||
          '',
        convocatoria_id: participacion.convocatoria_id || '',
        institucion_nombre: participacion.institucion_nombre || '',
        lugar: participacion.lugar || '',
        descripcion_proyecto: participacion.descripcion_proyecto || '',
        resultado: participacion.resultado || '',
        anio: participacion['año'] || '',
        imagen_url: participacion.imagen_url || '',
      });
      this.imagenesParticipacion = participacion.imagenes || [];
      this.enlaces = participacion.enlaces || [];
    } else {
      this.formParticipacion.reset();
    }
  }
  cerrarFormularioParticipacion() {
    this.formularioParticipacion = false;
    this.participacionEditando = null;
    this.formParticipacion.reset();
    this.imagenesParticipacion = [];
  }

  guardarParticipacion() {
    const formData = this.formParticipacion.value;
    const data: any = {
      nombre_proyecto: formData.nombre_proyecto,
      convocatoria_id: formData.convocatoria_id || null,
      convocatoria_nombre: formData.convocatoria_nombre || null,
      institucion_nombre: formData.institucion_nombre,
      lugar: formData.lugar,
      descripcion_proyecto: formData.descripcion_proyecto,
      resultado: formData.resultado,
      imagen_url: this.imagenesParticipacion[0] || null,
      imagenes: this.imagenesParticipacion.filter((i) => i),
      enlaces: this.enlaces.length > 0 ? this.enlaces : null,
    };
    data['año'] = formData.anio;

    if (this.participacionEditando) {
      this.store.dispatch(
        updateParticipacion({ id: this.participacionEditando.id, data }),
      );
    } else {
      this.store.dispatch(createParticipacion({ data }));
    }
    this.cerrarFormularioParticipacion();
  }
  agregarEnlace(input: HTMLInputElement) {
    const url = input.value.trim();
    if (url && !this.enlaces.includes(url)) {
      this.enlaces = [...this.enlaces, url];
    }
    input.value = '';
  }

  eliminarEnlace(url: string) {
    this.enlaces = this.enlaces.filter((e) => e !== url);
  }

  setResultado(r: string) {
    const actual = this.formParticipacion.get('resultado')?.value;
    this.formParticipacion.patchValue({ resultado: actual === r ? '' : r });
  }

  toggleParticipacion(id: string) {
    if (this.participacionesExpandidas.has(id)) {
      this.participacionesExpandidas.delete(id);
    } else {
      this.participacionesExpandidas.add(id);
    }
  }

  isParticipacionExpandida(id: string): boolean {
    return this.participacionesExpandidas.has(id);
  }

  subirImagenParticipacion(index: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      this.subiendoImagenParticipacion = true;
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url) => {
          this.imagenesParticipacion[index] = url;
          this.subiendoImagenParticipacion = false;
        },
        error: () => {
          this.subiendoImagenParticipacion = false;
        },
      });
    };
    input.click();
  }

  get imagenesSlots(): number[] {
    return Array.from({ length: this.maxImagenes }, (_, i) => i);
  }
  // trackBy
  trackByAlerta(index: number, grupo: any): string {
    return grupo.convocatoriaId;
  }

  trackByFavorito(index: number, favorito: Favorito): string {
    return favorito.id;
  }

  trackByParticipacion(index: number, participacion: Participacion): string {
    return participacion.id;
  }

  buscarConvocatoria(event: Event) {
    const texto = (event.target as HTMLInputElement).value;
    this.store
      .select(selectTodasConvocatorias)
      .pipe(take(1))
      .subscribe((convocatorias) => {
        this.convocatoriasFiltradas = convocatorias
          .filter((c) => c.titulo.toLowerCase().includes(texto.toLowerCase()))
          .slice(0, 5);
        this.mostrarSugerencias = this.convocatoriasFiltradas.length > 0;
      });
  }

  seleccionarConvocatoria(c: any) {
    this.formParticipacion.patchValue({
      convocatoria_id: c.id,
      convocatoria_nombre: c.titulo,
      lugar: c.ciudad + (c.region ? ', ' + c.region : ''),
    });
    this.mostrarSugerencias = false;
  }
}

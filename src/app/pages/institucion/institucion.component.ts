import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CloudinaryService } from '../../services/cloudinary.service';
import { ConvocatoriasService } from '../../services/convocatorias.service';
import { InstitucionService } from '../../services/institucion.service';
@Component({
  selector: 'app-institucion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './institucion.component.html',
  styleUrl: './institucion.component.scss',
})
export class InstitucionComponent implements OnInit {
  institucion: any = null;
  convocatorias: any[] = [];
  loading = true;
  tabActiva: 'convocatorias' | 'nueva' | 'perfil' = 'convocatorias';

  editando = false;
  guardando = false;
  mensajeExito = '';
  subiendoAvatar = false;
  avatarPreview: string | null = null;

  form: FormGroup;
  formConvocatoria: FormGroup;

  convocatoriaEditando: any = null;

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
  ].sort((a, b) => a.localeCompare(b, 'es'));

  disciplinasSeleccionadas: string[] = [];
  disciplinasAbiertas = false;

  lineaOpciones = [
    'prácticas situadas',
    'imagen',
    'corporalidades',
    'territorio',
    'archivo',
    'experimentación',
    'medio ambiente',
    'ruralidades',
    'comunidades',
    'sexualidades',
    'teorías queer',
    'amistad',
    'tecnología',
    'disidencias',
    'auto ficción',
    'feminismo',
    'memoria',
    'antropoceno',
    'lenguaje',
    'post-internet',
    'estudios ambientales',
    'cuidados',
    'activismos',
    'inidigenismo',
    'neocapitalismo',
    'capitalismo',
    'apropiacionismo',
    'geopoíticas',
    'bio política',
  ].sort((a, b) => a.localeCompare(b, 'es'));

  lineaSeleccionada: string[] = [];
  lineaAbierta = false;

  tiposOpciones = [
    'convocatoria',
    'residencia',
    'beca',
    'concurso',
    'ayuda',
    'exposicion',
    'premio',
  ].sort((a, b) => a.localeCompare(b, 'es'));

  tiposAbiertos = false;

  imagenesConvocatoria: string[] = [];
  subiendoImagenConvocatoria = false;
  maxImagenesConvocatoria = 5;

  get convocatoriasPublicadas(): number {
    return this.convocatorias.filter((c) => c.estado === 'publicada').length;
  }

  get convocatoriasPendientes(): number {
    return this.convocatorias.filter((c) => c.estado === 'pendiente').length;
  }

  get imagenesConvocatoriaSlots(): number[] {
    return Array.from({ length: this.maxImagenesConvocatoria }, (_, i) => i);
  }

  get convocatoriasActivas(): number {
    const hoy = new Date();
    return this.convocatorias.filter(
      (c) => c.estado === 'publicada' && new Date(c.fecha_limite) >= hoy,
    ).length;
  }

  constructor(
    private institucionService: InstitucionService,
    private cloudinaryService: CloudinaryService,
    private convocatoriasService: ConvocatoriasService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      nombre: [''],
      descripcion: [''],
      linea_curatorial: [''],
      ciudad: [''],
      region: [''],
      pais: [''],
      web: [''],
    });

    this.formConvocatoria = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required],
      fecha_inicio: [''],
      fecha_limite: ['', Validators.required],
      dotacion: [''],
      duracion: [''],
      requisitos: [''],
      ciudad: [''],
      region: [''],
      pais: [''],
      url_original: [''],
    });
  }

  ngOnInit(): void {
    this.institucionService.getMiInstitucion().subscribe({
      next: (data) => {
        this.institucion = data;
        this.convocatorias = data.convocatorias || [];
        this.loading = false;
        this.form.patchValue({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          linea_curatorial: data.linea_curatorial || '',
          ciudad: data.ciudad || '',
          region: data.region || '',
          pais: data.pais || '',
          web: data.web || '',
        });
      },
      error: () => {
        this.loading = false;
      },
    });
    this.route.queryParams.subscribe((params) => {
      if (params['tab']) {
        this.tabActiva = params['tab'];
      } else {
        this.tabActiva = 'convocatorias';
      }
    });
  }

  setTab(tab: 'convocatorias' | 'nueva' | 'perfil') {
    this.tabActiva = tab;
    this.convocatoriaEditando = null;
    this.mensajeExito = '';
    this.imagenesConvocatoria = [];
  }

  toggleEditar() {
    this.editando = !this.editando;
    this.mensajeExito = '';
    if (!this.editando) this.avatarPreview = null;
  }

  guardarPerfil() {
    this.guardando = true;
    const data: any = { ...this.form.value };
    if (this.avatarPreview) data.avatar_url = this.avatarPreview;

    this.institucionService.updateMiInstitucion(data).subscribe({
      next: (inst) => {
        this.institucion = inst;
        this.guardando = false;
        this.editando = false;
        this.avatarPreview = null;
        this.mensajeExito = 'Perfil actualizado correctamente';
        setTimeout(() => (this.mensajeExito = ''), 3000);
      },
      error: () => {
        this.guardando = false;
      },
    });
  }

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

  abrirEditar(conv: any) {
    this.convocatoriaEditando = conv;
    this.tabActiva = 'nueva';
    this.formConvocatoria.patchValue({
      titulo: conv.titulo || '',
      descripcion: conv.descripcion || '',
      tipo: conv.tipo || '',
      fecha_inicio: conv.fecha_inicio || '',
      fecha_limite: conv.fecha_limite || '',
      dotacion: conv.dotacion || '',
      duracion: conv.duracion || '',
      requisitos: conv.requisitos || '',
      ciudad: conv.ciudad || '',
      region: conv.region || '',
      pais: conv.pais || '',
      url_original: conv.url_original || '',
    });
    this.disciplinasSeleccionadas = conv.disciplinas || [];
    this.lineaSeleccionada = conv.linea_curatorial || [];
    this.imagenesConvocatoria = conv.imagenes || [];
  }
  guardarConvocatoria() {
    const data = {
      ...this.formConvocatoria.value,
      institucion_id: this.institucion.id,
      estado: 'pendiente',
      disciplinas: this.disciplinasSeleccionadas,
      linea_curatorial: this.lineaSeleccionada,
      pais: this.formConvocatoria.value.pais || this.institucion.pais || 'ES',
      imagenes: this.imagenesConvocatoria.filter((i) => i),
    };
    if (this.convocatoriaEditando) {
      this.convocatoriasService
        .update(this.convocatoriaEditando.id, data)
        .subscribe({
          next: () => {
            this.institucionService.getMiInstitucion().subscribe({
              next: (inst) => {
                this.institucion = inst;
                this.convocatorias = inst.convocatorias || [];
              },
            });
            this.setTab('convocatorias');
            this.mensajeExito = 'Convocatoria actualizada correctamente';
            setTimeout(() => (this.mensajeExito = ''), 3000);
          },
          error: () => {},
        });
    } else {
      this.convocatoriasService.create(data).subscribe({
        next: () => {
          this.institucionService.getMiInstitucion().subscribe({
            next: (inst) => {
              this.institucion = inst;
              this.convocatorias = inst.convocatorias || [];
            },
          });
          this.setTab('convocatorias');
          this.mensajeExito = 'Convocatoria enviada para revisión';
          setTimeout(() => (this.mensajeExito = ''), 3000);
        },
        error: () => {},
      });
    }
  }
  eliminarConvocatoria(id: string) {
    if (!confirm('¿Segura que quieres eliminar esta convocatoria?')) return;
    this.convocatoriasService.delete(id).subscribe({
      next: () => {
        this.convocatorias = this.convocatorias.filter((c) => c.id !== id);
      },
      error: () => {},
    });
  }
  toggleDisciplina(d: string): void {
    this.disciplinasSeleccionadas = this.disciplinasSeleccionadas.includes(d)
      ? this.disciplinasSeleccionadas.filter((x) => x !== d)
      : [...this.disciplinasSeleccionadas, d];
  }

  toggleTipo(tipo: string) {
    this.formConvocatoria.patchValue({ tipo });
    this.tiposAbiertos = false;
  }

  isDisciplinaSelected(d: string): boolean {
    return this.disciplinasSeleccionadas.includes(d);
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.field')) {
      this.disciplinasAbiertas = false;
      this.tiposAbiertos = false;
      this.lineaAbierta = false;
    }
  }

  agregarDisciplinaConv(input: HTMLInputElement) {
    const d = input.value.trim().toLowerCase();
    if (d && !this.disciplinasOpciones.includes(d)) {
      this.disciplinasOpciones = [...this.disciplinasOpciones, d].sort((a, b) =>
        a.localeCompare(b, 'es'),
      );
    }
    if (d && !this.disciplinasSeleccionadas.includes(d)) {
      this.disciplinasSeleccionadas = [...this.disciplinasSeleccionadas, d];
    }
    input.value = '';
  }

  toggleLineaConv(l: string) {
    this.lineaSeleccionada = this.lineaSeleccionada.includes(l)
      ? this.lineaSeleccionada.filter((x) => x !== l)
      : [...this.lineaSeleccionada, l];
  }

  isLineaSelected(l: string): boolean {
    return this.lineaSeleccionada.includes(l);
  }

  agregarLineaConv(input: HTMLInputElement) {
    const l = input.value.trim().toLowerCase();
    if (l && !this.lineaOpciones.includes(l)) {
      this.lineaOpciones = [...this.lineaOpciones, l].sort((a, b) =>
        a.localeCompare(b, 'es'),
      );
    }
    if (l && !this.lineaSeleccionada.includes(l)) {
      this.lineaSeleccionada = [...this.lineaSeleccionada, l];
    }
    input.value = '';
  }

  subirImagenConvocatoria(index: number) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      this.subiendoImagenConvocatoria = true;
      this.cloudinaryService.uploadImage(file).subscribe({
        next: (url) => {
          this.imagenesConvocatoria[index] = url;
          this.subiendoImagenConvocatoria = false;
        },
        error: () => {
          this.subiendoImagenConvocatoria = false;
        },
      });
    };
    input.click();
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/api';

  tabActiva: 'pendientes' | 'nueva' | 'usuarios' = 'pendientes';

  pendientes: any[] = [];
  usuarios: any[] = [];
  loading = true;
  mensajeExito = '';

  formConvocatoria: FormGroup;

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
    'sexualidad',
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
  ];
  tiposAbiertos = false;

  constructor(
    private http: HttpClient,
    private store: Store,
    private fb: FormBuilder,
  ) {
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
      pais: ['ES'],
      url_original: [''],
      institucion_nombre: [''],
    });
  }

  ngOnInit(): void {
    this.cargarPendientes();
    this.cargarUsuarios();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  cargarPendientes(): void {
    this.http
      .get<
        any[]
      >(`${this.apiUrl}/admin/pendientes`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.pendientes = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  cargarUsuarios(): void {
    this.http
      .get<
        any[]
      >(`${this.apiUrl}/admin/usuarios`, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: () => {},
      });
  }

  aprobar(id: string): void {
    this.http
      .put(
        `${this.apiUrl}/admin/convocatorias/${id}/aprobar`,
        {},
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: () => {
          this.pendientes = this.pendientes.filter((c) => c.id !== id);
          this.mostrarExito('Convocatoria publicada');
        },
        error: () => {},
      });
  }

  rechazar(id: string): void {
    this.http
      .put(
        `${this.apiUrl}/admin/convocatorias/${id}/rechazar`,
        {},
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: () => {
          this.pendientes = this.pendientes.filter((c) => c.id !== id);
          this.mostrarExito('Convocatoria rechazada');
        },
        error: () => {},
      });
  }

  desactivarUsuario(id: string): void {
    if (!confirm('¿Segura que quieres desactivar este usuario?')) return;
    this.http
      .put(
        `${this.apiUrl}/admin/usuarios/${id}/desactivar`,
        {},
        { headers: this.getHeaders() },
      )
      .subscribe({
        next: () => {
          this.usuarios = this.usuarios.map((u) =>
            u.id === id ? { ...u, activo: false } : u,
          );
          this.mostrarExito('Usuario desactivado');
        },
        error: () => {},
      });
  }

  guardarConvocatoria(): void {
    if (this.formConvocatoria.invalid) return;
    const data = {
      ...this.formConvocatoria.value,
      disciplinas: this.disciplinasSeleccionadas,
    };
    this.http
      .post(`${this.apiUrl}/admin/convocatorias`, data, {
        headers: this.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.formConvocatoria.reset({ pais: 'ES' });
          this.disciplinasSeleccionadas = [];
          this.tabActiva = 'pendientes';
          this.mostrarExito('Convocatoria publicada');
        },
        error: () => {},
      });
  }

  toggleDisciplina(d: string): void {
    this.disciplinasSeleccionadas = this.disciplinasSeleccionadas.includes(d)
      ? this.disciplinasSeleccionadas.filter((x) => x !== d)
      : [...this.disciplinasSeleccionadas, d];
  }

  isDisciplinaSelected(d: string): boolean {
    return this.disciplinasSeleccionadas.includes(d);
  }

  setTab(tab: 'pendientes' | 'nueva' | 'usuarios'): void {
    this.tabActiva = tab;
  }

  toggleTipo(tipo: string): void {
    this.formConvocatoria.patchValue({ tipo });
    this.tiposAbiertos = false;
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

  mostrarExito(msg: string): void {
    this.mensajeExito = msg;
    setTimeout(() => (this.mensajeExito = ''), 3000);
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
}

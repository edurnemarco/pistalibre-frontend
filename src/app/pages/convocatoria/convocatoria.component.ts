import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-convocatoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './convocatoria.component.html',
  styleUrl: './convocatoria.component.scss',
})
export class ConvocatoriaComponent implements OnInit {
  private apiUrl = environment.apiUrl;

  convocatoria: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.http.get<any>(`${this.apiUrl}/convocatorias/${id}/detalle`).subscribe({
      next: (data) => {
        this.convocatoria = data;
        this.loading = false;
        this.actualizarMetadatos(data);
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  private actualizarMetadatos(convocatoria: any): void {
    const titulo = `${convocatoria.titulo} — Pistalibre`;
    this.titleService.setTitle(titulo);

    this.metaService.updateTag({
      name: 'description',
      content: this.truncar(convocatoria.descripcion, 155),
    });

    this.metaService.updateTag({ property: 'og:title', content: titulo });
    this.metaService.updateTag({
      property: 'og:description',
      content: this.truncar(convocatoria.descripcion, 155),
    });
  }

  private truncar(texto: string, max: number): string {
    if (!texto) return '';
    return texto.length > max ? texto.slice(0, max).trim() + '…' : texto;
  }

  get participantes(): {
    nombre: string;
    anio: number;
    usuarioId: string | null;
  }[] {
    if (!this.convocatoria?.participaciones) return [];
    return this.convocatoria.participaciones
      .map((p: any) => ({
        nombre: p.usuario
          ? `${p.usuario.nombre} ${p.usuario.apellidos}`.trim()
          : 'Participante',
        anio: p['año'],
        usuarioId: p.usuario?.id || null,
      }))
      .sort((a: any, b: any) => b.anio - a.anio);
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  diasRestantes(fechaLimite: string): number {
    const hoy = new Date();
    const fecha = new Date(fechaLimite);
    return Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-perfil-publico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil-publico.component.html',
  styleUrl: './perfil-publico.component.scss',
})
export class PerfilPublicoComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/api';

  usuario: any = null;
  participaciones: any[] = [];
  loading = true;
  error = false;

  participacionesExpandidas = new Set<string>();
  imagenExpandida: string | null = null;
  imagenHover: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.http.get<any>(`${this.apiUrl}/usuarios/${id}`).subscribe({
      next: (user) => {
        this.usuario = user;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });

    this.http
      .get<any[]>(`${this.apiUrl}/usuarios/${id}/participaciones`)
      .subscribe({
        next: (data) => (this.participaciones = data),
        error: () => (this.participaciones = []),
      });
  }

  toggleParticipacion(id: string): void {
    if (this.participacionesExpandidas.has(id)) {
      this.participacionesExpandidas.delete(id);
    } else {
      this.participacionesExpandidas.add(id);
    }
  }

  isParticipacionExpandida(id: string): boolean {
    return this.participacionesExpandidas.has(id);
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}

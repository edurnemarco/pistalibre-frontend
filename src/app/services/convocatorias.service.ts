import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Convocatoria } from '../store/convocatorias/convocatorias.state';
import { environment } from './../../environments/environment';

export interface ParticipantePublico {
  id: string;
  año: number;
  resultado: string | null;
  lugar: string | null;
  nombre_proyecto: string | null;
  usuario: {
    id: string;
    nombre: string;
    apellidos: string;
    avatar_url: string | null;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return { Authorization: `Bearer ${token}` };
  }

  getConvocatorias(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.apiUrl}/convocatorias`);
  }

  getParticipantes(convocatoriaId: string): Observable<ParticipantePublico[]> {
    return this.http.get<ParticipantePublico[]>(
      `${this.apiUrl}/convocatorias/${convocatoriaId}/participantes`,
    );
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/convocatorias`, data, {
      headers: this.getHeaders(),
    });
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/convocatorias/${id}`, {
      headers: this.getHeaders(),
    });
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/convocatorias/${id}`, data, {
      headers: this.getHeaders(),
    });
  }
}

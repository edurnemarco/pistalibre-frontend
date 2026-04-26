import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFavoritos(token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favoritos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  addFavorito(token: string, convocatoriaId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/favoritos`,
      { convocatoria_id: convocatoriaId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  deleteFavorito(token: string, favoritoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favoritos/${favoritoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

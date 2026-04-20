import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritosService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  //private apiUrl = 'http://192.168.0.22:8000/api';

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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerfilService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getMe(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updatePerfil(token: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getPerfilPublico(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }
}

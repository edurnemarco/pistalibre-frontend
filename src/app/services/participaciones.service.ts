import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ParticipacionesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getParticipaciones(token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/participaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createParticipacion(token: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/participaciones`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateParticipacion(token: string, id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/participaciones/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteParticipacion(token: string, id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/participaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

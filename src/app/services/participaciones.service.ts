import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipacionesService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  // private apiUrl = 'http://192.168.0.22:8000';

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

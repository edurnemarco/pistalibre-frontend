import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstitucionService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): { Authorization: string } {
    const token = localStorage.getItem('token') || '';
    return { Authorization: `Bearer ${token}` };
  }

  getMiInstitucion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mi-institucion`, {
      headers: this.getHeaders(),
    });
  }

  updateMiInstitucion(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/mi-institucion`, data, {
      headers: this.getHeaders(),
    });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/instituciones/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAlertas(token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alertas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createAlerta(token: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/alertas`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteAlerta(token: string, alertaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alertas/${alertaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteAlertasByConvocatoria(
    token: string,
    convocatoriaId: string,
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/alertas/convocatoria/${convocatoriaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }
}

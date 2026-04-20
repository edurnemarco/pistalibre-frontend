import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  //private apiUrl = 'http://192.168.0.22:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(data: {
    nombre: string;
    email: string;
    password: string;
    tipo: string;
    apellidos?: string;
    ciudad?: string;
    region?: string;
    pais?: string;
    web?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(token: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  me(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Convocatoria } from '../store/convocatorias/convocatorias.state';

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriasService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  //private apiUrl = 'http://192.168.0.22:8000/api';

  constructor(private http: HttpClient) {}

  getConvocatorias(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.apiUrl}/convocatorias`);
  }
}

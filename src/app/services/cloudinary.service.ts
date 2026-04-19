import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = 'dtcduyczk';
  private uploadPreset = 'pistalibre';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http
      .post(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        formData,
      )
      .pipe(map((response: any) => response.secure_url));
  }
}

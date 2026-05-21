import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login endpoint with correct credentials', () => {
    const mockResponse = {
      user: {
        id: '1',
        nombre: 'Test',
        email: 'test@test.com',
        tipo: 'artista',
      },
      token: 'fake-token',
    };

    service.login('test@test.com', 'password123').subscribe((res) => {
      expect(res.token).toBe('fake-token');
      expect(res.user.email).toBe('test@test.com');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@test.com',
      password: 'password123',
    });
    req.flush(mockResponse);
  });

  it('should call register endpoint with correct data', () => {
    const mockResponse = {
      user: {
        id: '1',
        nombre: 'Edurne',
        email: 'edurne@test.com',
        tipo: 'artista',
      },
      token: 'fake-token',
    };

    const userData = {
      nombre: 'Edurne',
      email: 'edurne@test.com',
      password: 'password123',
      tipo: 'artista',
    };

    service.register(userData).subscribe((res) => {
      expect(res.user.nombre).toBe('Edurne');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should call logout endpoint', () => {
    service.logout('fake-token').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush({});
  });
});

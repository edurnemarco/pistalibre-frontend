import { TestBed } from '@angular/core/testing';

import { ConvocatoriasService } from './convocatorias.service';

describe('ConvocatoriasService', () => {
  let service: ConvocatoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvocatoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

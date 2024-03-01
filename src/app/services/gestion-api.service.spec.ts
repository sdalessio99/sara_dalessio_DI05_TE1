import { TestBed } from '@angular/core/testing';

import { GestionApiService } from './gestion-api.service';

describe('GestionApiService', () => {
  let service: GestionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AdicionaisService } from './adicionais.service';

describe('AdicionaisService', () => {
  let service: AdicionaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdicionaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

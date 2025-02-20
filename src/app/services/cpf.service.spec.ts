import { TestBed } from '@angular/core/testing';

import { CpfService } from './cpf.service';

describe('CpfService', () => {
  let service: CpfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

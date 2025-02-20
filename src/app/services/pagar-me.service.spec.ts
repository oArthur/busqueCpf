import { TestBed } from '@angular/core/testing';

import { PagarMeService } from './pagar-me.service';

describe('PagarMeService', () => {
  let service: PagarMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagarMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FormatCpfService } from './format-cpf.service';

describe('FormatCpfService', () => {
  let service: FormatCpfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatCpfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

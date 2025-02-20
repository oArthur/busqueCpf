import { TestBed } from '@angular/core/testing';

import { BdPedidosService } from './bd-pedidos.service';

describe('BdPedidosService', () => {
  let service: BdPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

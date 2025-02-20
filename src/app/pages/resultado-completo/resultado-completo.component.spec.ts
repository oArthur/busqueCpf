import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoCompletoComponent } from './resultado-completo.component';

describe('ResultadoCompletoComponent', () => {
  let component: ResultadoCompletoComponent;
  let fixture: ComponentFixture<ResultadoCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadoCompletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultadoCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

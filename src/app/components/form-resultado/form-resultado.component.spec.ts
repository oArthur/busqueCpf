import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResultadoComponent } from './form-resultado.component';

describe('FormResultadoComponent', () => {
  let component: FormResultadoComponent;
  let fixture: ComponentFixture<FormResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

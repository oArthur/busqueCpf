import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraPackComponent } from './compra-pack.component';

describe('CompraPackComponent', () => {
  let component: CompraPackComponent;
  let fixture: ComponentFixture<CompraPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompraPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

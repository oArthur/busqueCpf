import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoComprarComponent } from './como-comprar.component';

describe('ComoComprarComponent', () => {
  let component: ComoComprarComponent;
  let fixture: ComponentFixture<ComoComprarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComoComprarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComoComprarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

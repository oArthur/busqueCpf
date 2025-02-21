import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoverBaseComponent } from './remover-base.component';

describe('RemoverBaseComponent', () => {
  let component: RemoverBaseComponent;
  let fixture: ComponentFixture<RemoverBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoverBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoverBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

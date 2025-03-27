import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPackComponent } from './card-pack.component';

describe('CardPackComponent', () => {
  let component: CardPackComponent;
  let fixture: ComponentFixture<CardPackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

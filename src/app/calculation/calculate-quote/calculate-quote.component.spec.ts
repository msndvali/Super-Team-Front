import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateQuoteComponent } from './calculate-quote.component';

describe('CalculateQuoteComponent', () => {
  let component: CalculateQuoteComponent;
  let fixture: ComponentFixture<CalculateQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculateQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculateQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

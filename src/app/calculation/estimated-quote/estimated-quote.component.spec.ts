import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatedQuoteComponent } from './estimated-quote.component';

describe('EstimatedQuoteComponent', () => {
  let component: EstimatedQuoteComponent;
  let fixture: ComponentFixture<EstimatedQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatedQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatedQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

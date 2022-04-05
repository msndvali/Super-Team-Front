import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeOfWorkComponent } from './scope-of-work.component';

describe('ScopeOfWorkComponent', () => {
  let component: ScopeOfWorkComponent;
  let fixture: ComponentFixture<ScopeOfWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScopeOfWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

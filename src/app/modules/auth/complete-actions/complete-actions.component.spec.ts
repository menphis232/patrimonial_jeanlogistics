import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteActionsComponent } from './complete-actions.component';

describe('CompleteActionsComponent', () => {
  let component: CompleteActionsComponent;
  let fixture: ComponentFixture<CompleteActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

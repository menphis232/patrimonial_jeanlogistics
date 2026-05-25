import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeneralActionsComponent } from './list-general-actions.component';

describe('ListGeneralActionsComponent', () => {
  let component: ListGeneralActionsComponent;
  let fixture: ComponentFixture<ListGeneralActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGeneralActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListGeneralActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

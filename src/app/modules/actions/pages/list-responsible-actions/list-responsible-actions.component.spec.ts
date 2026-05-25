import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResponsibleActionsComponent } from './list-responsible-actions.component';

describe('ListResponsibleActionsComponent', () => {
  let component: ListResponsibleActionsComponent;
  let fixture: ComponentFixture<ListResponsibleActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListResponsibleActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListResponsibleActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

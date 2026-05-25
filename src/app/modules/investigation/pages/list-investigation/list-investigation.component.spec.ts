import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvestigationComponent } from './list-investigation.component';

describe('ListInvestigationComponent', () => {
  let component: ListInvestigationComponent;
  let fixture: ComponentFixture<ListInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInvestigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

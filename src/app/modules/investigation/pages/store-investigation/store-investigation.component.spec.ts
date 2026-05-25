import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreInvestigationComponent } from './store-investigation.component';

describe('StoreInvestigationComponent', () => {
  let component: StoreInvestigationComponent;
  let fixture: ComponentFixture<StoreInvestigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreInvestigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreInvestigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

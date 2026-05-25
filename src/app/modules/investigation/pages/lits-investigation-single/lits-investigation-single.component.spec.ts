import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LitsInvestigationSingleComponent } from './lits-investigation-single.component';

describe('LitsInvestigationSingleComponent', () => {
  let component: LitsInvestigationSingleComponent;
  let fixture: ComponentFixture<LitsInvestigationSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LitsInvestigationSingleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LitsInvestigationSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

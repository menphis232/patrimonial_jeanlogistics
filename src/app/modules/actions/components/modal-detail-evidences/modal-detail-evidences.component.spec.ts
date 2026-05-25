import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailEvidencesComponent } from './modal-detail-evidences.component';

describe('ModalDetailEvidencesComponent', () => {
  let component: ModalDetailEvidencesComponent;
  let fixture: ComponentFixture<ModalDetailEvidencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetailEvidencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailEvidencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

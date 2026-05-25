import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailIncidentComponent } from './modal-detail-incident.component';

describe('ModalDetailIncidentComponent', () => {
  let component: ModalDetailIncidentComponent;
  let fixture: ComponentFixture<ModalDetailIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailIncidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

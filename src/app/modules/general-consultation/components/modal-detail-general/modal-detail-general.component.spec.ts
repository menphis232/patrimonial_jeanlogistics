import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailGeneralComponent } from './modal-detail-general.component';

describe('ModalDetailGeneralComponent', () => {
  let component: ModalDetailGeneralComponent;
  let fixture: ComponentFixture<ModalDetailGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

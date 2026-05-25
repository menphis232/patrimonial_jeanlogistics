import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailToursComponent } from './modal-detail-tours.component';

describe('ModalDetailErgonomicComponent', () => {
  let component: ModalDetailToursComponent;
  let fixture: ComponentFixture<ModalDetailToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailToursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

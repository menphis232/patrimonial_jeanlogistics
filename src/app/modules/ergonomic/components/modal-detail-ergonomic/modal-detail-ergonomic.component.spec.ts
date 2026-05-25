import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailErgonomicComponent } from './modal-detail-ergonomic.component';

describe('ModalDetailErgonomicComponent', () => {
  let component: ModalDetailErgonomicComponent;
  let fixture: ComponentFixture<ModalDetailErgonomicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailErgonomicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailErgonomicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

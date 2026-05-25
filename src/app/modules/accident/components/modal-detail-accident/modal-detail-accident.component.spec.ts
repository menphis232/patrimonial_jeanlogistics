import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailAccidentComponent } from './modal-detail-accident.component';

describe('ModalDetailAccidentComponent', () => {
  let component: ModalDetailAccidentComponent;
  let fixture: ComponentFixture<ModalDetailAccidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetailAccidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQrGuardsComponent } from './modal-qr-guards.component';

describe('ModalQrGuardsComponent', () => {
  let component: ModalQrGuardsComponent;
  let fixture: ComponentFixture<ModalQrGuardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalQrGuardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQrGuardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

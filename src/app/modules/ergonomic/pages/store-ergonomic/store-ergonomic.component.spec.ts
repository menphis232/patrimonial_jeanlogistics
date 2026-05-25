import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreErgonomicComponent } from './store-ergonomic.component';

describe('StoreErgonomicComponent', () => {
  let component: StoreErgonomicComponent;
  let fixture: ComponentFixture<StoreErgonomicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreErgonomicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreErgonomicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

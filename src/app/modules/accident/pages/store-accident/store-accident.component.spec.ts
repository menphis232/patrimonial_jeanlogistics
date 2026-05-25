import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAccidentComponent } from './store-accident.component';

describe('StoreAccidentComponent', () => {
  let component: StoreAccidentComponent;
  let fixture: ComponentFixture<StoreAccidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAccidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

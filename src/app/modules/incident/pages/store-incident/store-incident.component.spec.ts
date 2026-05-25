import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreIncidentComponent } from './store-incident.component';

describe('StoreIncidentComponent', () => {
  let component: StoreIncidentComponent;
  let fixture: ComponentFixture<StoreIncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreIncidentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreIncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

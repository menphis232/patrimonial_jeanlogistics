import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreAreasComponent } from './store-areas.component';

describe('StoreAreasComponent', () => {
  let component: StoreAreasComponent;
  let fixture: ComponentFixture<StoreAreasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreProtectionComponent } from './store-protection.component';

describe('StoreProtectionComponent', () => {
  let component: StoreProtectionComponent;
  let fixture: ComponentFixture<StoreProtectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

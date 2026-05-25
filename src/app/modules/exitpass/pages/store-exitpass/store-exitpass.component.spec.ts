import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreExitpassComponent } from './store-exitpass.component';

describe('StoreExitpassComponent', () => {
  let component: StoreExitpassComponent;
  let fixture: ComponentFixture<StoreExitpassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreExitpassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreExitpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

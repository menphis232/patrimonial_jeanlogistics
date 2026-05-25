import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreMovementsComponent } from './store-movements.component';

describe('StoreMovementsComponent', () => {
  let component: StoreMovementsComponent;
  let fixture: ComponentFixture<StoreMovementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

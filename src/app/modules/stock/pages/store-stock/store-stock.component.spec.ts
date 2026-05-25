import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreStockComponent } from './store-stock.component';

describe('StoreMovementsComponent', () => {
  let component: StoreStockComponent;
  let fixture: ComponentFixture<StoreStockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

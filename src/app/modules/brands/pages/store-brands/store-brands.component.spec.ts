import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreBrandsComponent } from './store-brands.component';

describe('StoreBrandsComponent', () => {
  let component: StoreBrandsComponent;
  let fixture: ComponentFixture<StoreBrandsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListBrandsComponent } from './list-brands.component';

describe('PatientsComponent', () => {
  let component: ListBrandsComponent;
  let fixture: ComponentFixture<ListBrandsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

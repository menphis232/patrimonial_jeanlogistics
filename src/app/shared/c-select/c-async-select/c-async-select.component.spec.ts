import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAsyncSelectComponent } from './c-async-select.component';

describe('CAsyncSelectComponent', () => {
  let component: CAsyncSelectComponent;
  let fixture: ComponentFixture<CAsyncSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAsyncSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CAsyncSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

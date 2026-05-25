import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreActivePrincipleComponent } from './store-active-principle.component';

describe('StoreActivePrincipleComponent', () => {
  let component: StoreActivePrincipleComponent;
  let fixture: ComponentFixture<StoreActivePrincipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreActivePrincipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreActivePrincipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListActivePrincipleComponent } from './list-active-principle.component';

describe('PatientsComponent', () => {
  let component: ListActivePrincipleComponent;
  let fixture: ComponentFixture<ListActivePrincipleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListActivePrincipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListActivePrincipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

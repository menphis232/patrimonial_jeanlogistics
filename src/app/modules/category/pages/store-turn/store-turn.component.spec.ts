import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreTurnComponent } from './store-turn.component';

describe('StoreTurnComponent', () => {
  let component: StoreTurnComponent;
  let fixture: ComponentFixture<StoreTurnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreTurnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

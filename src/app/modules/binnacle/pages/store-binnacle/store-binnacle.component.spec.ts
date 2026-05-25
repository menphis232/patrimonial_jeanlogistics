import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBinnacleComponent } from './store-binnacle.component';

describe('StoreBinnacleComponent', () => {
  let component: StoreBinnacleComponent;
  let fixture: ComponentFixture<StoreBinnacleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBinnacleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBinnacleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

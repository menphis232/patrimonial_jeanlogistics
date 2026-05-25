import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRecipeComponent } from './store-recipe.component';

describe('StoreRecipeComponent', () => {
  let component: StoreRecipeComponent;
  let fixture: ComponentFixture<StoreRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeRoutes } from './recipe.routing';
import { StoreRecipeComponent } from './pages/store-recipe/store-recipe.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    StoreRecipeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(RecipeRoutes),
    MaterialModule,
    SharedModule
  ],
  providers:[provideNativeDateAdapter()]
})
export class RecipeModule { }

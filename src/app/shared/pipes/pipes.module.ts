import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColorPipe } from './status/status.pipe';
import { FisrtLetterPipe } from './fisrtLetter/fisrtLetter.pipe';
import { TypeAssistsPipe } from './type-assists/type-assists.pipe';


@NgModule({
  declarations: [
    StatusColorPipe,
    FisrtLetterPipe,
    TypeAssistsPipe
  ],
  exports: [
    StatusColorPipe,
    FisrtLetterPipe,
    TypeAssistsPipe
  ],
  providers: [
    StatusColorPipe,
    FisrtLetterPipe,
    TypeAssistsPipe
  ],
  imports: [
    CommonModule
  ]
})

export class PipesModule { }
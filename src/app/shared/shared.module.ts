import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularMaterialModule} from "./angular-material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class SharedModule {
}

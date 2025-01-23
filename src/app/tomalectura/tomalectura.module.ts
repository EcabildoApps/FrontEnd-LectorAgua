import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomalecturaPageRoutingModule } from './tomalectura-routing.module';

import { TomalecturaPage } from './tomalectura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TomalecturaPageRoutingModule
  ],
  declarations: [TomalecturaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TomalecturaPageModule { }

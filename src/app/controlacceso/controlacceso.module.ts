import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlaccesoPageRoutingModule } from './controlacceso-routing.module';

import { ControlaccesoPage } from './controlacceso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlaccesoPageRoutingModule
  ],
  declarations: [ControlaccesoPage]
})
export class ControlaccesoPageModule {}

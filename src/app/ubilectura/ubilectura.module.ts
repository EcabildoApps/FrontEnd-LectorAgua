import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UbilecturaPageRoutingModule } from './ubilectura-routing.module';

import { UbilecturaPage } from './ubilectura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbilecturaPageRoutingModule
  ],
  declarations: [UbilecturaPage]
})
export class UbilecturaPageModule {}

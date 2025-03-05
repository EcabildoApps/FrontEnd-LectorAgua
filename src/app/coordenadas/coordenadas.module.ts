import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoordenadasPageRoutingModule } from './coordenadas-routing.module';

import { CoordenadasPage } from './coordenadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoordenadasPageRoutingModule
  ],
  declarations: [CoordenadasPage]
})
export class CoordenadasPageModule {}

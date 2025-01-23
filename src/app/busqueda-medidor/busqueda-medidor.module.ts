import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusquedaMedidorPageRoutingModule } from './busqueda-medidor-routing.module';

import { BusquedaMedidorPage } from './busqueda-medidor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusquedaMedidorPageRoutingModule
  ],
  declarations: [BusquedaMedidorPage]
})
export class BusquedaMedidorPageModule {}

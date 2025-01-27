import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
  declarations: [BusquedaMedidorPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusquedaMedidorPageModule {}

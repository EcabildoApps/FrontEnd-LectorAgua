import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListapruralesPageRoutingModule } from './listaprurales-routing.module';

import { ListapruralesPage } from './listaprurales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListapruralesPageRoutingModule
  ],
  declarations: [ListapruralesPage]
})
export class ListapruralesPageModule {}

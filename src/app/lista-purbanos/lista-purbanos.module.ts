import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPurbanosPageRoutingModule } from './lista-purbanos-routing.module';

import { ListaPurbanosPage } from './lista-purbanos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPurbanosPageRoutingModule
  ],
  declarations: [ListaPurbanosPage]
})
export class ListaPurbanosPageModule {}

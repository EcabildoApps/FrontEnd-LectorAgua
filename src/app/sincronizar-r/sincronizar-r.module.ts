import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarRPageRoutingModule } from './sincronizar-r-routing.module';

import { SincronizarRPage } from './sincronizar-r.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarRPageRoutingModule
  ],
  declarations: [SincronizarRPage]
})
export class SincronizarRPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SincronizarUPageRoutingModule } from './sincronizar-u-routing.module';

import { SincronizarUPage } from './sincronizar-u.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SincronizarUPageRoutingModule
  ],
  declarations: [SincronizarUPage]
})
export class SincronizarUPageModule {}

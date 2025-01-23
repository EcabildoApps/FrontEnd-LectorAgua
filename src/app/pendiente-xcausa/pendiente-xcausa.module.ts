import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PendienteXcausaPageRoutingModule } from './pendiente-xcausa-routing.module';

import { PendienteXcausaPage } from './pendiente-xcausa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PendienteXcausaPageRoutingModule
  ],
  declarations: [PendienteXcausaPage]
})
export class PendienteXcausaPageModule {}

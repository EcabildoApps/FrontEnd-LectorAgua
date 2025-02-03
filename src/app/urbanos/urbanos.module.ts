import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UrbanosPageRoutingModule } from './urbanos-routing.module';

import { UrbanosPage } from './urbanos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UrbanosPageRoutingModule
  ],
  declarations: [UrbanosPage]
})
export class UrbanosPageModule {}

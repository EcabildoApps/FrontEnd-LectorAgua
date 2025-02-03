import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RuralesPageRoutingModule } from './rurales-routing.module';

import { RuralesPage } from './rurales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RuralesPageRoutingModule
  ],
  declarations: [RuralesPage]
})
export class RuralesPageModule {}

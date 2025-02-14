import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsultageoPageRoutingModule } from './consultageo-routing.module';

import { ConsultageoPage } from './consultageo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultageoPageRoutingModule
  ],
  declarations: [ConsultageoPage]
})
export class ConsultageoPageModule {}

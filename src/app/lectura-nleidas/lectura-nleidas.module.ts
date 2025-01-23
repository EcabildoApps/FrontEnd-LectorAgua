import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecturaNleidasPageRoutingModule } from './lectura-nleidas-routing.module';

import { LecturaNleidasPage } from './lectura-nleidas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecturaNleidasPageRoutingModule
  ],
  declarations: [LecturaNleidasPage]
})
export class LecturaNleidasPageModule {}

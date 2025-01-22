import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecturaPageRoutingModule } from './lectura-routing.module';

import { LecturaPage } from './lectura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecturaPageRoutingModule
  ],
  declarations: [LecturaPage]
})
export class LecturaPageModule {}

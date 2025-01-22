import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecRapidaPageRoutingModule } from './lec-rapida-routing.module';

import { LecRapidaPage } from './lec-rapida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecRapidaPageRoutingModule
  ],
  declarations: [LecRapidaPage]
})
export class LecRapidaPageModule {}

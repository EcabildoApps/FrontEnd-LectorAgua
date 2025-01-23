import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorrigelecturaPageRoutingModule } from './corrigelectura-routing.module';

import { CorrigelecturaPage } from './corrigelectura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorrigelecturaPageRoutingModule
  ],
  declarations: [CorrigelecturaPage]
})
export class CorrigelecturaPageModule {}

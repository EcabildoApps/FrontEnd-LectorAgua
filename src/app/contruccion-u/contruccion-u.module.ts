import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContruccionUPageRoutingModule } from './contruccion-u-routing.module';

import { ContruccionUPage } from './contruccion-u.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContruccionUPageRoutingModule
  ],
  declarations: [ContruccionUPage]
})
export class ContruccionUPageModule {}

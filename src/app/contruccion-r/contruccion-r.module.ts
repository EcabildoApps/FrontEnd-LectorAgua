import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContruccionRPageRoutingModule } from './contruccion-r-routing.module';

import { ContruccionRPage } from './contruccion-r.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContruccionRPageRoutingModule
  ],
  declarations: [ContruccionRPage]
})
export class ContruccionRPageModule {}

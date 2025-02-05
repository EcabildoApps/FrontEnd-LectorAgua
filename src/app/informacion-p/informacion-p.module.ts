import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionPPageRoutingModule } from './informacion-p-routing.module';

import { InformacionPPage } from './informacion-p.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPPageRoutingModule
  ],
  declarations: [InformacionPPage]
})
export class InformacionPPageModule {}

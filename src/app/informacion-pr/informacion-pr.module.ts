import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionPRPageRoutingModule } from './informacion-pr-routing.module';

import { InformacionPRPage } from './informacion-pr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPRPageRoutingModule
  ],
  declarations: [InformacionPRPage]
})
export class InformacionPRPageModule {}

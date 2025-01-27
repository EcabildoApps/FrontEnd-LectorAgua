import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LecturagtPageRoutingModule } from './lecturagt-routing.module';

import { LecturagtPage } from './lecturagt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LecturagtPageRoutingModule
  ],
  declarations: [LecturagtPage]
})
export class LecturagtPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfraestructuraPRPageRoutingModule } from './infraestructura-pr-routing.module';

import { InfraestructuraPRPage } from './infraestructura-pr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfraestructuraPRPageRoutingModule
  ],
  declarations: [InfraestructuraPRPage]
})
export class InfraestructuraPRPageModule {}

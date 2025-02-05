import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfraestructuraPageRoutingModule } from './infraestructura-routing.module';

import { InfraestructuraPage } from './infraestructura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfraestructuraPageRoutingModule
  ],
  declarations: [InfraestructuraPage]
})
export class InfraestructuraPageModule {}

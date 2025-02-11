import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbilecturaPage } from './ubilectura.page';

const routes: Routes = [
  {
    path: '',
    component: UbilecturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbilecturaPageRoutingModule {}

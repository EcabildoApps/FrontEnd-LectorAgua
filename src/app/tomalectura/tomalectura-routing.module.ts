import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TomalecturaPage } from './tomalectura.page';

const routes: Routes = [
  {
    path: '',
    component: TomalecturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TomalecturaPageRoutingModule {}

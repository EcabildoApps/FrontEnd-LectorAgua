import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfraestructuraPage } from './infraestructura.page';

const routes: Routes = [
  {
    path: '',
    component: InfraestructuraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfraestructuraPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfraestructuraPRPage } from './infraestructura-pr.page';

const routes: Routes = [
  {
    path: '',
    component: InfraestructuraPRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfraestructuraPRPageRoutingModule {}

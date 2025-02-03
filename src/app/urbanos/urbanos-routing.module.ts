import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UrbanosPage } from './urbanos.page';

const routes: Routes = [
  {
    path: '',
    component: UrbanosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UrbanosPageRoutingModule {}

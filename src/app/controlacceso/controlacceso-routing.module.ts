import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlaccesoPage } from './controlacceso.page';

const routes: Routes = [
  {
    path: '',
    component: ControlaccesoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlaccesoPageRoutingModule {}

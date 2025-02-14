import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultageoPage } from './consultageo.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultageoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultageoPageRoutingModule {}

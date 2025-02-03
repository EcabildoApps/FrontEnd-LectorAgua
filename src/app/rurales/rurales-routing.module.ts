import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RuralesPage } from './rurales.page';

const routes: Routes = [
  {
    path: '',
    component: RuralesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RuralesPageRoutingModule {}

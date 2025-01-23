import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorrigelecturaPage } from './corrigelectura.page';

const routes: Routes = [
  {
    path: '',
    component: CorrigelecturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorrigelecturaPageRoutingModule {}

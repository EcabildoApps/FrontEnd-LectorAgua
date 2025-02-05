import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPurbanosPage } from './lista-purbanos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPurbanosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPurbanosPageRoutingModule {}

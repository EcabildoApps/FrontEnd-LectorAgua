import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListapruralesPage } from './listaprurales.page';

const routes: Routes = [
  {
    path: '',
    component: ListapruralesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListapruralesPageRoutingModule {}

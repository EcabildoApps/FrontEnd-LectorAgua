import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaMedidorPage } from './busqueda-medidor.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaMedidorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaMedidorPageRoutingModule {}

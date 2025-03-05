import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoordenadasPage } from './coordenadas.page';

const routes: Routes = [
  {
    path: '',
    component: CoordenadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoordenadasPageRoutingModule {}

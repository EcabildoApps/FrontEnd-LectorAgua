import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarRPage } from './sincronizar-r.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarRPageRoutingModule {}

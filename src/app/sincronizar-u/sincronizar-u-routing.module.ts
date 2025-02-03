import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizarUPage } from './sincronizar-u.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizarUPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizarUPageRoutingModule {}

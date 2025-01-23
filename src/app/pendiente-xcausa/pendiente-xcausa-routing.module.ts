import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PendienteXcausaPage } from './pendiente-xcausa.page';

const routes: Routes = [
  {
    path: '',
    component: PendienteXcausaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendienteXcausaPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContruccionRPage } from './contruccion-r.page';

const routes: Routes = [
  {
    path: '',
    component: ContruccionRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContruccionRPageRoutingModule {}

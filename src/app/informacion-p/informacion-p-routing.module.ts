import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionPPage } from './informacion-p.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionPPageRoutingModule {}

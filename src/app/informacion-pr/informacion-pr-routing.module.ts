import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionPRPage } from './informacion-pr.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionPRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionPRPageRoutingModule {}

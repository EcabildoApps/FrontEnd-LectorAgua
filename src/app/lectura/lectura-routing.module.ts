import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecturaPage } from './lectura.page';

const routes: Routes = [
  {
    path: '',
    component: LecturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturaPageRoutingModule {}

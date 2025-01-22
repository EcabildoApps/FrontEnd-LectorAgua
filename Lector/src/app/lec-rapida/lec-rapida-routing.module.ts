import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecRapidaPage } from './lec-rapida.page';

const routes: Routes = [
  {
    path: '',
    component: LecRapidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecRapidaPageRoutingModule {}

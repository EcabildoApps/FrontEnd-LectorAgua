import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecturaNleidasPage } from './lectura-nleidas.page';

const routes: Routes = [
  {
    path: '',
    component: LecturaNleidasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturaNleidasPageRoutingModule {}

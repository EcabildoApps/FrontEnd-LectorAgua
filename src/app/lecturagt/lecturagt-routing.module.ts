import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LecturagtPage } from './lecturagt.page';

const routes: Routes = [
  {
    path: '',
    component: LecturagtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturagtPageRoutingModule {}

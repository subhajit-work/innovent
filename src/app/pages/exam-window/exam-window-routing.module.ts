import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamWindowPage } from './exam-window.page';

const routes: Routes = [
  {
    path: '',
    component: ExamWindowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamWindowPageRoutingModule {}

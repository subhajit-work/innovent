import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExamGroupPage } from './exam-group.page';

const routes: Routes = [
  {
    path: '',
    component: ExamGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamGroupPageRoutingModule {}

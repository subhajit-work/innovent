import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverallReportPage } from './overall-report.page';

const routes: Routes = [
  {
    path: '',
    component: OverallReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverallReportPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverallReportPageRoutingModule } from './overall-report-routing.module';

import { OverallReportPage } from './overall-report.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    Ng2GoogleChartsModule,
    OverallReportPageRoutingModule
  ],
  declarations: [OverallReportPage]
})
export class OverallReportPageModule {}

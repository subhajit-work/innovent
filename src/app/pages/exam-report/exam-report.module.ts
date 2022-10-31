import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamReportPageRoutingModule } from './exam-report-routing.module';

import { ExamReportPage } from './exam-report.page';
import { SharedModule } from 'src/app/shared/shared.module';
import 'hammerjs';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    Ng2GoogleChartsModule,
    ExamReportPageRoutingModule
  ],
  declarations: [ExamReportPage]
})
export class ExamReportPageModule {}

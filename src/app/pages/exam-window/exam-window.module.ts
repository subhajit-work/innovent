import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamWindowPageRoutingModule } from './exam-window-routing.module';

import { ExamWindowPage } from './exam-window.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ExamWindowPageRoutingModule
  ],
  declarations: [ExamWindowPage]
})
export class ExamWindowPageModule {}

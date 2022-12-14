import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificationEmailPageRoutingModule } from './verification-email-routing.module';

import { VerificationEmailPage } from './verification-email.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VerificationEmailPageRoutingModule
  ],
  declarations: [VerificationEmailPage]
})
export class VerificationEmailPageModule {}

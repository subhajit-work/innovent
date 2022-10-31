import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterSuccessPageRoutingModule } from './register-success-routing.module';

import { RegisterSuccessPage } from './register-success.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RegisterSuccessPageRoutingModule
  ],
  declarations: [RegisterSuccessPage]
})
export class RegisterSuccessPageModule {}

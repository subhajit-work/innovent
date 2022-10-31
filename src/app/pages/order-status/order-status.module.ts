import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderStatusPageRoutingModule } from './order-status-routing.module';

import { OrderStatusPage } from './order-status.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OrderStatusPageRoutingModule
  ],
  declarations: [OrderStatusPage]
})
export class OrderStatusPageModule {}

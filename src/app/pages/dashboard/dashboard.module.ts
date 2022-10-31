import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { DashboardPage } from './dashboard.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuperTabsModule,
    DashboardPageRoutingModule,
    SharedModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}

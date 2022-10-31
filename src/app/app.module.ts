import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule , HTTP_INTERCEPTORS } from  '@angular/common/http';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';
import { SharedModule } from './shared/shared.module';
import { InterceptorProvider } from './services/interceptors/interceptor';

import { AddCommonModelPageModule } from './pages/modal/add-common-model/add-common-model.module';

//==  gelocation gps === (https://www.freakyjolly.com/ionic-4-turn-on-device-gps-in-ionic-4-application-without-leaving-app-using-ionic-native-plugin/)
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

// background mode on
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

import { SuperTabsModule } from '@ionic-super-tabs/angular';
import 'hammerjs';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    SuperTabsModule.forRoot(),
    SharedModule, //share module import here
    BrowserAnimationsModule,
    AddCommonModelPageModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    LocationAccuracy,
    BackgroundMode,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorProvider,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { Component, ViewChildren } from '@angular/core';

import { Platform, AlertController, IonRouterOutlet, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { CommonUtils } from './services/common-utils/common-utils';
import { ResponsiveService } from './services/responsive.service'; //responive check

import { environment } from '../environments/environment';

// BackgroundMode enable
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import * as moment from 'moment';
declare var cordova;

/* tslint:disable */ 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // register back button
  @ViewChildren(IonRouterOutlet) routerOutlets;

  // server api
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  checkAuthentication;
  userInfoLoading;
  userInfoDataall;
  menuPages:any[];
  mapped;
  panelOpenState: boolean;
  url_path_name;
  logoutLoading;


  /* public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/dashboard',
      icon: 'list'
    },
    {
      title: 'auth',
      url: '/auth',
      icon: 'list'
    }
  ]; */

  constructor(
    private backgroundMode: BackgroundMode,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService : AuthService,
    private alertController : AlertController,
    private responsiveService : ResponsiveService,
    private http: HttpClient,
    private router : Router,
    private commonUtils: CommonUtils, // common functionlity come here
    public menuCtrl: MenuController,
  ) {
    this.initializeApp();

    // register back button
    this.backButtonEvent();
    this.menuCtrl.enable(true);
  }

  // register back button
  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
          // alert('this.router >'+ this.router);
          // alert('this.router.url >'+ this.router.url);
            if (this.router.url === '/auth' || this.router.url === '/dashboard') {
                // navigator['app'].exitApp();
                this.presentAlertConfirm();
            } else {
                window.history.back();
            }
        });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Exit App',
      message: 'Are you sure you want to exit the app?',
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });
  
    await alert.present();
  }

  // Update app start
  async updateAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Update App!',
      message: 'A new version of the application is available and is required to continue, please click below to update to the latest version.',
      cssClass: 'custom-alert update-app',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {
          navigator['app'].exitApp();
        }
      }, {
        text: 'Update',
        handler: () => {
          // location.href = this.userInfoDataall.apk_link;
          console.log('this.userInfoDataall.apk_link', this.userInfoDataall.apk_link);
          
          window.open(this.userInfoDataall.apk_link, "_blank");
          navigator['app'].exitApp();
        }
      }]
    });
  
    await alert.present();
  }
  // Update app end

  initializeApp() {
    
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.userInfoData();
      
      /* if (this.platform.is('cordova')) {
        // oneSignal call
        this.setupPush();
      } */

      // background mode enable
      //this.backgroundMode.enable();
      //cordova.plugins.backgroundMode.disableBatteryOptimizations();
      this.backgroundMode.on("activate").subscribe(()=>{
        this.backgroundMode.disableWebViewOptimizations();
          // this.backgroundMode.disableBatteryOptimizations();
          cordova.plugins.backgroundMode.disableBatteryOptimizations();

          /* you add <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
          in
          platforms/android/app/src/main/AndroidManifest.xml */

          console.log("background activate !!!!");
      });


      this.loginCheck();
    });

    // let curentDate = new Date();
    // let date = moment(curentDate).format('DD/MM/YYYY');
    // console.log('let curentDate', curentDate);
    // console.log('let date', date);

    // if(date > '31/12/2021'){
    //   console.log('error');
    //   navigator['app'].exitApp();
    // }else {
    //   console.log('good');
      
    // }
  }


  loginCheck(){
    this.authService.autoLogin().pipe(
      take(1)
    ).subscribe(resData => {
      console.log('resData +++++++++++++++++++++++++++++++=&&&&&& (autoLogin)>', resData);
      if(resData){
        this.checkAuthentication = true;
        this.userInfoData();
        // console.log('User have Login');
      }else{
        this.checkAuthentication = false;
        // console.log('user have NOT Login');
      }
    });
  }

  // user info
  userInfoData(){
    // this.authService.globalparamsData.pipe(
    //   take(1)
    // ).subscribe(res => {
    //   console.log('componet.ts Toke store >>>>>>>>>>>>>>>111', res);
    console.log('Ready________updateAlertConfirm()___');
      // if(res){
        this.userInfoLoading = true;

        // menu data array
        this.menuPages = [];

        this.http.get('common_details.php').subscribe(
          (res:any) => {
            this.userInfoLoading = false;
            console.log("view data  userinfo  res -------------------->", res.return_data);
            if(res.return_status > 0){
              this.userInfoDataall = res.return_data;

              if(res.return_data.apk_version !== '0.0.2'){
                this.updateAlertConfirm();
                console.log('Update @@@@@@@@@@@@@');
                
              }

              // update observable service data
              this.commonUtils.getUserInfoService(res.return_data);

              // console.log('menu_data',res.return_data.menu_data);
              // this.menuPages = res.return_data.menu_data.list;


              // menu data show array
              if(res.return_data.menu_data){

                this.menuPages = res.return_data.menu_data;

                console.log('Menu data >>>', this.menuPages);
                // res.return_data.menu_data.list.forEach((val, ind) => {
                //   // console.log('menu DAta', val);
                //   // object to array convert
                //   if(val.pages && val.pages!= null && val.pages!= '' && val.pages != undefined){
                //     this.mapped = Object.keys(val.pages).map(key => ({type: key, value: val.pages[key]}));
                //   }else {
                //     this.mapped = '';
                //   }
                  
                //   // if(val.module_access == 1){
                //     this.menuPages.push({'value':val, 'pages':this.mapped});
                //   // }

                // });
                // console.log('menuPages', this.menuPages);
                // --active menu start---
                //  this.panelOpenState = false;
                // if(this.menuPages != undefined || this.menuPages != null ){
                //   this.menuPages.forEach((val, ind) => {
                //     if(val.pages != null){
                //       val.pages.forEach((val2, ind2) => {
                //         if(this.url_path_name == val2.value.page_url.split('/')[1]){
                //           val.isOpen = true;
                //         }
                //       });
                //     }
                //   })
                // } 
                //active menu end
              }

            }
          },
          errRes => {
            this.userInfoLoading = false;
          }
        );
      // }

    // });
  }

  closeModal() {
    console.log('Clicked');
    // this.menuCtrl.enable(false);
    this.menuCtrl.toggle();
  }
  // logout functionlity
  async logOutUser(){
    const alert = await this.alertController.create({
      header: 'Log Out',
      message: 'Are you sure you want to Log Out?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancelBtn',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            // this.authService.logout();
            this.logoutLoading = true;
            //logout data call

            this.authService.globalparamsData.pipe(
              take(1)
            ).subscribe(res => {
            console.log('componet.ts Toke store 2222 >>>>>>>>>>>>>>>111', res);
            this.http.get('login_register.php?action=logout').subscribe(
              (res:any) => {
                this.logoutLoading = false;
                console.log("Edit data  res >", res.return_data);
                if(res.return_status > 0){
                  this.authService.logout();

                  // user menu call
                  // this.appComponent.userInfoData();

                }
              },
              errRes => {
                this.logoutLoading = false;
              }
            );
            });
          }
        }
      ]
    });
    await alert.present(); 
  }
}

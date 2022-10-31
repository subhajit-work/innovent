import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { MenuController, Platform, AlertController, ModalController } from '@ionic/angular';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Subscription, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { AddCommonModelPage } from '../../pages/modal/add-common-model/add-common-model.page';

import { ResponsiveService } from '../../services/responsive.service';
import { AppComponent } from '../../app.component';
import { CommonUtils } from '../../services/common-utils/common-utils';
import { NavController } from '@ionic/angular';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

declare var $ :any; //jquary declear

/* tslint:disable */ 
@Component({
  selector: 'common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
})
export class CommonHeaderComponent implements OnInit, OnDestroy {
  
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  officeInLoading;
  officeInData;
  officeOutLoading;
  officeOutData;
  userInfoLoading;
  locationCoords: any;
  timetest: any;

  form_api;
  private logoutDataSubscribe : Subscription;
  private formSubmitSearchSubscribe : Subscription;
  private viewPageDataSubscribe : Subscription;
  private officeDataSubscribe : Subscription;
  public isMobile: Boolean;
  main_menu;
  side_main_menu;
  searchModel;
  form_api_logout;
  site_info_data;
  get_user_dtls;
  current_url_path_name;
  viewLoadData;
  listing_view_url;

  constructor( 
    private authService: AuthService,
    private commonUtils : CommonUtils,
    private menuCtrl: MenuController,
    private http : HttpClient,
    private router: Router,
    private navCtrl : NavController,
    private modalController : ModalController,
    private responsiveService : ResponsiveService,
    private platform : Platform,
    private alertController : AlertController,
    private appComponent : AppComponent,
    private eRef: ElementRef,
    private androidPermissions: AndroidPermissions,
    ) { }

  // init
  ngOnInit() {

    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.timetest = Date.now();

    this.platform.ready().then(() => {

      /* if (this.platform.is('android')) {
        alert('running on Android device!');
        console.log("running on Android device!");
      }
      if (this.platform.is('ios')) {
          console.log("running on iOS device!");
      } */

      /* if (this.platform.is('mobileweb')) {
          console.log("running in a browser on mobile!");
      } */

    });

    /* this.onResize();
    this.responsiveService.checkWidth(); */


    this.form_api_logout = 'login/return_logout'; //logout api call
    this.form_api = 'subscriber/return_add'; //subscriber api call

    this.listing_view_url = 'student/dashboard';

    // this.viewPageData();
    
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      // console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        // this.get_user_dtls = res.user;
        
        // this.viewPageData();

        // user details set
        // this.commonUtils.onSigninStudentInfo(res.user);
      }
    });

    // user info data get
    this.userInfoLoading = true;
    this.logoutDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userInfoLoading = false;
        this.get_user_dtls = res;
        if(res && res.userinfo && res.userinfo.officein_time && res.userinfo.officein_time != null && res.userinfo.officein_time != ''){
          this.officeInData = res.userinfo.officein_time;
        }
        if(res && res.userinfo && res.userinfo.officeout_time && res.userinfo.officeout_time != null && res.userinfo.officeout_time != ''){
          this.officeOutData = res.userinfo.officeout_time;
        }
      }else{
        this.userInfoLoading = false;
        this.get_user_dtls = '';
      }
    });


    // get header data from commoninfo api
    this.logoutDataSubscribe = this.commonUtils.commonDataobservable.subscribe((res:any) => {
      if(res != null || res != undefined){
        // console.log('header globalparamsData res HEADER >>>>>>>>>>>', res);
        if(res.menu_data){
          this.main_menu = res.menu_data.main_menu.list;
          this.side_main_menu = res.menu_data.side_menu.list;
          this.site_info_data = res.sitedetails;
          // console.log('this.site_info_data ==================>', this.site_info_data );
        }
      }
    });


    // current url name
    this.current_url_path_name =  this.router.url.split('/')[1];
    // console.log('this.current_url_path_name ==== s>>', this.current_url_path_name);

    // alert('ionViewinit');

  }

  /* onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  } */

  ionViewWillEnter(){
    /* this.form_api = 'logout'; //logout api call
    this.authService.globalparamsData.subscribe(res => {
      console.log('header globalparamsData res >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.user;
      }
    }); */

    // this.viewPageData();
    // alert('ionViewWillEnter');

  }

  ionViewDidEnter(){
    // alert('ionViewDidEnter');
  }

  // click to go page
  goPage(_url){
    console.log('Click');
    this.router.navigate(['/',_url]);
  }

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.officeDataSubscribe !== undefined){
      this.officeDataSubscribe.unsubscribe();
    }
    if(this.logoutDataSubscribe !== undefined){
      this.logoutDataSubscribe.unsubscribe();
    }
    if(this.formSubmitSearchSubscribe !== undefined){
      this.formSubmitSearchSubscribe.unsubscribe();
    }
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})

export class WelcomePage implements OnInit {

  /*Veriable*/
  private viewPageDataSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  userInfoLoading;
  get_user_dtls;
  listing_view_url;
  viewLoadData;
  pageData;
  viewData;
  genderArry;

  // server api
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{},
  ]

  // Slider
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay:true
  };

  

  constructor(
    public menuCtrl: MenuController,
    private commonUtils : CommonUtils,
    private http : HttpClient,
    private router : Router,
    private platform : Platform
  ) { 

  }

  ngOnInit() {

    // view page url name
    this.listing_view_url = 'home_page.php';

    this.viewPageData();

    // menu show
    this.menuCtrl.enable(true);

    if ((this.platform.is('android') || this.platform.is('ios')) && !this.platform.is('mobileweb')) {
      // alert('running on Android device!');
      //console.log("running on Android device!");

      // gps backgroud check (for mobile android/ios)
      // this.startBackgroundGeolocation();
      
    }else{
      // desktop view or website
    }

    // user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.get_user_dtls = res;
        console.log('dashboard userinfo',this.get_user_dtls);
        this.userInfoLoading = false;
      }else{
        this.get_user_dtls = '';
        this.userInfoLoading = false;
      }
    });
  }

  ionViewWillEnter() {

    // menu show
    this.menuCtrl.enable(true);
  }

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    console.log('dashboard userinfo',this.get_user_dtls);
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        
        this.pageData = res.return_data;

        console.log('this.pageData', this.pageData);
        if(res.return_status > 0){
          console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  closeModal() {
    console.log('Clicked');
  }


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.userInfoDataSubscribe !== undefined){
        this.userInfoDataSubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}

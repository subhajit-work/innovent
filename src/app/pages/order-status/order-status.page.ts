import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from './../../services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
})

export class OrderStatusPage implements OnInit {

  /*Veriable*/
  private viewPageDataSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  userInfoLoading;
  get_user_dtls;
  file_url = environment.fileUrl;
  main_url = environment.apiUrl;
  listing_view_url;
  parms_action_id;
  viewLoadData;
  pageData;
  viewData;
  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{}
  ]

  constructor(
    public menuCtrl: MenuController,
    private activatedRoute : ActivatedRoute,
    private commonUtils : CommonUtils,
    private http : HttpClient,
  ) { }

  ngOnInit() {
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    // menu show
    this.menuCtrl.enable(true);

    if(this.parms_action_id == 0){
      // view page url name
      this.listing_view_url = 'order_failed.php';
      this.viewPageData();
    }else {
      // view page url name
      this.listing_view_url = 'order_success.php?order_id='+this.parms_action_id ;
      this.viewPageData();
    }

    // user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userInfoLoading = false;
        this.pageData = res.user_info;
        console.log('profile userinfo',this.pageData);
      }else{
        this.userInfoLoading = false;
        this.pageData = '';
      }
    });
    
  }

 // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        this.viewData = res.return_data;

        console.log('this.viewData', this.viewData);
        // if(res.return_status > 0){
        //   this.viewData = res.return_data[this.parms_action_id];
        //   console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        // }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.userInfoDataSubscribe !== undefined){
        this.userInfoDataSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}
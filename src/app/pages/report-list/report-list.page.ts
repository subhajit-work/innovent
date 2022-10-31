import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.page.html',
  styleUrls: ['./report-list.page.scss'],
})

export class ReportListPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  private viewPageDataSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  parms_action_id;
  parms_action_name;
  viewLoadData;
  listing_view_url;
  viewData;
  pageData;
  commonPageData;
  get_user_dtls;
  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{}
  ]

  constructor(
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private commonUtils : CommonUtils,
    private authService : AuthService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    console.log('this.parms_action_name >>>>>>>>>>>>>>', this.parms_action_name);
    console.log('this.parms_action_id >>>>>>>>>>>>>>', this.parms_action_id);
    

    // view page url name
    this.listing_view_url = 'report_list.php?exam_id='+this.parms_action_id ;
    
    // user info data get
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res: any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if (res) {
        this.get_user_dtls = res.user_info;
        console.log('dashboard userinfo', this.get_user_dtls);
      } else {
        this.get_user_dtls = '';
      }
    });

    this.viewPageData();
  }

  // ================== view data fetch start =====================
    viewPageData(){
      console.log('viewPageData', this.http);
      this.viewLoadData = true;
      this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
        (res:any) => {
          this.viewLoadData = false;
          this.pageData = res.return_data;

          console.log('this.pageData', this.pageData);
          if(res.return_status > 0){
            this.viewData = res.return_data[this.parms_action_id];
            console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
          }
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
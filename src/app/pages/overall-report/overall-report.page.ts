import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { IntlService } from "@progress/kendo-angular-intl";
import { GoogleChartInterface } from 'ng2-google-charts';


@Component({
  selector: 'app-overall-report',
  templateUrl: './overall-report.page.html',
  styleUrls: ['./overall-report.page.scss'],
})

export class OverallReportPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  // variable declartion section
  private viewPageDataSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  parms_action_name;
  parms_action_exam_id;
  parms_action_center_id;
  parms_action_exam_date;
  viewLoadData;
  listing_view_url;
  viewData;
  commonPageData;
  get_user_dtls;
  terms_page;
  marks_obtained = 0;
  marks_left = 0;
  marks_deducted = 0;

  public pieData: any[] = [
    { category: "0-14", value: 0.2545 },
    { category: "15-24", value: 0.1552 },
    { category: "25-54", value: 0.4059 },
    { category: "55-64", value: 0.0911 },
    { category: "65+", value: 0.0933 },
  ];


  
  
  // api parms
  api_parms: any = {};

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
    private intl: IntlService
  ) {
   }



  ngOnInit() {
    this.parms_action_exam_id = this.activatedRoute.snapshot.paramMap.get('examid');
    this.parms_action_center_id = this.activatedRoute.snapshot.paramMap.get('centerid');
    this.parms_action_exam_date = this.activatedRoute.snapshot.paramMap.get('examdate');

    console.log('parms_action_exam_id', this.parms_action_exam_id);
    console.log('parms_action_center_id', this.parms_action_center_id);
    console.log('parms_action_exam_date', this.parms_action_exam_date);
    

    
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

    // view page url name
    this.listing_view_url = 'overall_test_result.php?exam_id='+this.parms_action_exam_id+'&center_id='+this.parms_action_center_id+'&student_id='+this.get_user_dtls.student_id;
    

    this.viewPageData();
  }

  ionViewWillEnter(){
    this.ngOnInit();
  }

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        
        console.log("view data  res  -------------------->", res.return_data);
        this.viewData = res.return_data;
        this.marks_obtained = res.return_data.pie_chart.marks_obtained;
        this.marks_deducted = res.return_data.pie_chart.marks_deducted;
        this.marks_left = res.return_data.pie_chart.marks_left;
        console.log("marks_obtained", this.marks_obtained);
        console.log("marks_deducted", this.marks_deducted);
        console.log("marks_left", this.marks_left);
        this.pieChart = {
          chartType: 'PieChart',
          dataTable: [
            ['Task', 'Hours per Day'],
            ['Marks Obtained', this.marks_obtained],
            ['Marks Deducted', this.marks_deducted],
            ['Marks Left', this.marks_left]
          ],
          //firstRowIsData: true,
          options: {
            'title': 'Chart of Marks Deviation Calculation',
            width: '100%',
          },

        }
        // Bar chart
        this.barChart = {
          chartType: 'ColumnChart',
          dataTable: [
            ['TIME TAKEN PER QUESTION', 'Best', 'Average', 'Worst'],
            ['Correct', res.return_data.bar_chart.correct_response.best, res.return_data.bar_chart.correct_response.average, res.return_data.bar_chart.correct_response.worst],
            ['Inorrect', res.return_data.bar_chart.incorrect_response.best, res.return_data.bar_chart.incorrect_response.average, res.return_data.bar_chart.incorrect_response.worst],
            ['Unattempted', res.return_data.bar_chart.unattempted_response.best, res.return_data.bar_chart.unattempted_response.average, res.return_data.bar_chart.unattempted_response.worst]
          ],
          //firstRowIsData: true,
          options: {
            'title': 'CHART OF TIME TAKEN PER QUESTION',
            width: '100%',
          },

        }
        // Scatter chart start
        this.scatterChart = {
          chartType: 'ScatterChart',
          dataTable: [
            ['X', '1','2', '3'],
            [ res.return_data.graph_chart.marks_obtained, res.return_data.graph_chart.correct_response_total_time, null, null],
            [ res.return_data.graph_chart.marks_deducted, null, res.return_data.graph_chart.incorrect_response_total_time, null],
            [ res.return_data.graph_chart.marks_left, null, null, res.return_data.graph_chart.unattempted_response_total_time]
          ],
          options: {
            title: 'Marks vs. Time comparison',
            hAxis: {title: 'Marks', minValue: 0, maxValue: res.return_data.graph_chart.hAxis_max},
            vAxis: {title: 'Time (in min)', minValue: 0, maxValue: res.return_data.graph_chart.vAxis_max},
            legend: 'none',
            pointSize: 10,
            series: {
              0: { pointShape: 'circle' },
              1: { pointShape: 'triangle' },
              2: { pointShape: 'square' }
            }
          }

        }
        this.viewLoadData = false;
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  // pie chart start
  public pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  // pie chart end

  // Bar chart start
  public barChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
    
    options: {title: 'Countries'}
  };
  // Bar chart end

  // Scatter chart start
  public scatterChart: GoogleChartInterface = {
    chartType: 'ScatterChart',
    
  };
  // Scatter chart end

  // Download pdf start
  downloadPdf(){
    
    // location.href = this.main_url+'/report_download.php?exam_id='+this.parms_action_exam_id+'&exam_date='+this.parms_action_exam_date+'&student_id='+this.get_user_dtls.student_id+'&exam_date='+this.parms_action_exam_date+'&center_id='+this.parms_action_center_id;
    window.open(this.main_url+'/overall_report_download.php?exam_id='+this.parms_action_exam_id+'&student_id='+this.get_user_dtls.student_id+'&center_id='+this.parms_action_center_id, "_blank");
  }

  // Download pdf end

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
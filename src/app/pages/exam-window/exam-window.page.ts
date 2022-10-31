import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import * as moment from 'moment';
import {Location} from '@angular/common';
export class Data {
  currentPage: number = 1;
  classArray: any = [];
  answeredArray: any = [];
  timeArray: any = [];
  currentPageAnsere: boolean = false;

  // answered: number = 0;
  // notAnswered: number = 0;
  // forReview: number = 0;
  // notVisited: number = 0;
  interval: any = null;
  time: any = null;
  display: number = 0
}
@Component({
  selector: 'app-exam-window',
  templateUrl: './exam-window.page.html',
  styleUrls: ['./exam-window.page.scss'],
})

export class ExamWindowPage implements OnInit, OnDestroy {

  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  public loopData: any;
  public loopCount: number = 0;
  public answereObject = []
  public notVisited: number = 0;
  public answered: number = 0;
  public notAnswered: number = 0;
  public forReview: number = 0;
  public total: number = 0;
  public time: any=null;
  public display:number=0;
  public minit:number=0;
  public sec:number=0
  // variable declartion section
  private viewPageDataSubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  parms_action_id;
  parms_action_name;
  viewLoadData;
  listing_view_url;
  viewData;
  pageData;
  commonPageData;
  userInfoLoading;
  get_user_dtls;
  subId;
  currentDate;
  currentDateOnly;
  totalQuestionAnswer;

  timeLeft: number = 5;
  interval;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  // skeleton loading
  skeleton = [
    {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
  ]


  private userInfoDataSubscribe: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private commonUtils: CommonUtils,
    private authService: AuthService,
    private router: Router,
    private _formBuilder: FormBuilder,
    private alertController : AlertController,
    public menuCtrl: MenuController,
    private _location: Location,
    private loadingController: LoadingController,
  ) { 
    this.menuCtrl.enable(false);
  }


  ngOnInit() {

    this.totalTimeFun()
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');

    console.log('this.parms_action_name >>>>>>>>>>>>>>', this.parms_action_name);
    console.log('this.parms_action_id >>>>>>>>>>>>>>', this.parms_action_id);


    // view page url name
    // this.listing_view_url = 'exam.php?exam_id=1362';
    this.listing_view_url = 'exam.php?exam_id=' + this.parms_action_id;


    this.viewPageData();

    // user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res: any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if (res) {
        this.get_user_dtls = res;
        console.log('dashboard userinfo', this.get_user_dtls);
        this.userInfoLoading = false;
      } else {
        this.get_user_dtls = '';
        this.userInfoLoading = false;
      }
    });

  }

  // ================== view data fetch start =====================
  viewPageData() {

    // Current date time check
    let curentDate = new Date();
    this.currentDate = moment(curentDate).format('YYYY-MM-DD HH:mm:ss');
    this.currentDateOnly = moment(curentDate).format('YYYY-MM-DD');

    console.log('this.currentDate', this.currentDate);
    

    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res: any) => {
        

        if(res.return_status == 0) {
          this._location.back();
        }else{
          this.viewLoadData = false;
          this.pageData = res.return_data;
          console.log("page data", this.pageData);
          this.loopData = this.pageData.subject[this.loopCount].question;
          console.log("loopData", this.loopData);
          this.subId =  this.pageData.subject[0].id;
          for (let j = 0; j < this.pageData.subject.length; j++) {
            this.total = this.total + this.pageData.subject[j].question.length;
            let data = new Data();
            this.answereObject[j] = data;
            for (let i = 0; i < this.loopData.length; i++) {
              this.answereObject[j].classArray[i] = "notVisited"
              this.answereObject[j].answeredArray[i] = '';
              this.answereObject[j].timeArray[i] = 0;
              // this.answereObject[j].notVisited = this.loopData.length - 1
            }
          }
          this.totalValue();
          this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] + this.answereObject[this.loopCount].display;
          this.timeFun();
          console.log("??????????????????", this.answereObject)
          console.log('this.pageData', this.pageData);
          if (res.return_status > 0) {
            this.viewData = res.return_data[this.parms_action_id];
            console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
          }
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  checkString(value, j) {
    return value.includes(j);
  }
  changeCurrentPage(index) {
    this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] + this.answereObject[this.loopCount].display;
    this.timeFun();
    // if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "notVisited") {
    //   // if (this.answereObject[this.loopCount].currentPageAnsere) {
    //   //   // this.answereObject[this.loopCount].answered++;
    //   // } else {
    //   //   this.answereObject[this.loopCount].notAnswered++;
    //   // }
    // } else if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "notAnswer") {
    //   if (this.answereObject[this.loopCount].currentPageAnsere) {
    //     this.answereObject[this.loopCount].answered++;
    //     this.answereObject[this.loopCount].notAnswered--;
    //   }
    // }
    if (this.answereObject[this.loopCount].currentPageAnsere) {
      this.changeCurrentPageClass("Answer")
    } else {
      if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "Answer") {
        this.changeCurrentPageClass("notAnswer");
      }
    }
    // this.answereObject[this.loopCount].notVisited = (this.loopData.length - 1) - (this.answereObject[this.loopCount].notAnswered + this.answereObject[this.loopCount].answered + this.answereObject[this.loopCount].forReview);
    this.answereObject[this.loopCount].currentPage = index;
    this.answereObject[this.loopCount].currentPageAnsere = false;
    this.totalValue()
  }

  nextPage() {

    if (this.loopData.length > this.answereObject[this.loopCount].currentPage) {
      this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] + this.answereObject[this.loopCount].display;
      this.timeFun();
      // if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "notVisited") {
      //   if (this.answereObject[this.loopCount].currentPageAnsere) {
      //     this.answereObject[this.loopCount].answered++;
      //   } else {
      //     this.answereObject[this.loopCount].notAnswered++;
      //   }
      // } else if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "notAnswer") {
      //   if (this.answereObject[this.loopCount].currentPageAnsere) {
      //     this.answereObject[this.loopCount].answered++;
      //     this.answereObject[this.loopCount].notAnswered--;
      //   }
      // } else if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "reviewAnswer") {
      //   if (this.answereObject[this.loopCount].currentPageAnsere) {
      //     this.answereObject[this.loopCount].answered++;
      //     this.answereObject[this.loopCount].forReview--;
      //   } else {
      //     this.answereObject[this.loopCount].notAnswered++;
      //     this.answereObject[this.loopCount].forReview--;
      //   }
      // }
      if (this.answereObject[this.loopCount].currentPageAnsere) {
        this.changeCurrentPageClass("Answer")
      } else {
        if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "Answer") {
          this.changeCurrentPageClass("notAnswer");
        }
      }
      this.answereObject[this.loopCount].currentPage = this.answereObject[this.loopCount].currentPage + 1;
    } else {
      if (this.loopCount < this.pageData.subject.length) {
        if (this.answereObject[this.loopCount].currentPageAnsere) {
          this.changeCurrentPageClass("Answer")
        } else {
          if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "Answer") {
            this.changeCurrentPageClass("notAnswer");
          }
        }
        this.loopCount = this.loopCount + 1;
        this.loopData = this.pageData.subject[this.loopCount].question;
      }
    }
    // this.answereObject[this.loopCount].notVisited = (this.loopData.length - 1) - (this.answereObject[this.loopCount].notAnswered + this.answereObject[this.loopCount].answered + this.answereObject[this.loopCount].forReview);
    this.answereObject[this.loopCount].currentPageAnsere = false;
    this.totalValue()
    // for(let i=0; i< this.pageData.subject.length; i ++) {

    // }
    this.subId=this.pageData.subject[this.loopCount].id;
  }
  peviousPage() {
    if (this.answereObject[this.loopCount].currentPage > 1) {
      this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] + this.answereObject[this.loopCount].display;
      this.timeFun();
      // if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "notVisited") {
      //   if (this.answereObject[this.loopCount].currentPageAnsere) {
      //     this.answereObject[this.loopCount].answered++;
      //   } else {
      //     this.answereObject[this.loopCount].notAnswered++;
      //   }
      // } else if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "notAnswer") {
      //   if (this.answereObject[this.loopCount].currentPageAnsere) {
      //     this.answereObject[this.loopCount].answered++;
      //     this.answereObject[this.loopCount].notAnswered--;
      //   }
      // } else if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "reviewAnswer") {
      //   if (this.answereObject[this.loopCount].currentPageAnsere) {
      //     this.answereObject[this.loopCount].answered++;
      //     this.answereObject[this.loopCount].forReview--;
      //   } else {
      //     this.answereObject[this.loopCount].notAnswered++;
      //     this.answereObject[this.loopCount].forReview--;
      //   }
      // }
      if (this.answereObject[this.loopCount].currentPageAnsere) {
        this.changeCurrentPageClass("Answer")
      } else {
        if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "Answer") {
          this.changeCurrentPageClass("notAnswer");
        }
      }
      this.answereObject[this.loopCount].currentPage = this.answereObject[this.loopCount].currentPage - 1;
    } else {
      if (this.loopCount > 0) {
        if (this.answereObject[this.loopCount].currentPageAnsere) {
          this.changeCurrentPageClass("Answer")
        } else {
          if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "Answer") {
            this.changeCurrentPageClass("notAnswer");
          }
        }
        this.loopCount--;
        this.loopData = this.pageData.subject[this.loopCount].question;
      }
    }
    // this.answereObject[this.loopCount].notVisited = (this.loopData.length) - (this.answereObject[this.loopCount].notAnswered + this.answereObject[this.loopCount].answered + this.answereObject[this.loopCount].forReview);
    this.answereObject[this.loopCount].currentPageAnsere = false;
    this.totalValue()
    this.subId=this.pageData.subject[this.loopCount].id;
  }
  onItemChange(value, type, j) {

    if (type == "radioButton") {
      this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] = value.target.value;
    } else if (type == "checkBox") {
      if (this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] == "") {
        this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] = "" + value.target.value;
      } else {
        var index = this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1].indexOf(j);
        if (index != -1) {
          this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1].replace(j, "");
        } else {
          this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] + "" + value.target.value;
        }
        console.log(this.answereObject[this.loopCount].answeredArray);
      }
    } else if (type == "Descriptive") {
      this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] = value.target.value;
    }

    this.answereObject[this.loopCount].currentPageAnsere = true;
  }
  changeCurrentPageClass(className) {
    this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] = className;
  }
  reviewAnswer() {
    this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] + this.answereObject[this.loopCount].display;
    this.timeFun();
    if (this.loopData.length > this.answereObject[this.loopCount].currentPage) {
      this.changeCurrentPageClass("reviewAnswer");
      if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "reviewAnswer") {
        this.answereObject[this.loopCount].forReview++;
      }
      this.answereObject[this.loopCount].currentPage = this.answereObject[this.loopCount].currentPage + 1;
    } else {
      if (this.loopCount < this.pageData.subject.length) {
        this.changeCurrentPageClass("reviewAnswer");
      if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] != "reviewAnswer") {
        this.answereObject[this.loopCount].forReview++;
      }
        this.loopCount = this.loopCount + 1;
        this.loopData = this.pageData.subject[this.loopCount].question;
      }
    }
    this.answereObject[this.loopCount].notVisited = (this.loopData.length - 1) - (this.answereObject[this.loopCount].notAnswered + this.answereObject[this.loopCount].answered + this.answereObject[this.loopCount].forReview);
    this.totalValue()
    this.answereObject[this.loopCount].currentPageAnsere = false;
    this.subId=this.pageData.subject[this.loopCount].id;
  }
  clearAnswer() {
    this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1] = "";
    if (this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] == "Answer") {
      // this.answereObject[this.loopCount].answered--;
      // this.answereObject[this.loopCount].notAnswered++;
      this.answereObject[this.loopCount].classArray[this.answereObject[this.loopCount].currentPage - 1] = "notAnswer"
    }
    this.answereObject[this.loopCount].currentPageAnsere = false;
    // console.log("Clear Answare", this.answereObject[this.loopCount].answeredArray[this.answereObject[this.loopCount].currentPage - 1])
  }

  changePaper(subject, subjectId) {
    console.log('subjectId', subjectId);
    this.subId = subjectId;
    
    for (let i = 0; i < this.pageData.subject.length; i++) {
      if (this.pageData.subject[i].name == subject) {
        this.loopCount = i;
        this.loopData = this.pageData.subject[this.loopCount].question;
      }
    }
    console.log(this.answereObject);

  }
  totalValue() {
    this.notVisited = 0;
    this.answered = 0;
    this.notAnswered = 0;
    this.forReview = 0
    for (let i = 0; i < this.pageData.subject.length; i++) {
      for (let j = 0; j < this.answereObject[i].classArray.length; j++) {
        if (this.answereObject[i].classArray[j] == 'notVisited') {
          this.notVisited++;
        } else if (this.answereObject[i].classArray[j] == 'Answer') {
          this.answered++;
        } else if (this.answereObject[i].classArray[j] == 'notAnswer') {
          this.notAnswered++;
        } else if (this.answereObject[i].classArray[j] == 'reviewAnswer') {
          this.forReview++;
        }
      }
    }
    if(this.notVisited!=0)
      this.notVisited--;
    // if(this.loopData.length==this.answereObject[this.loopCount].currentPage && this.pageData.subject.length==this.loopCount+1){
    //   this.notVisited--;
    // }
  }
  // view data fetch end


  timeFun() {
    clearInterval(this.answereObject[this.loopCount].interval);
    this.answereObject[this.loopCount].display = 0;
    this.answereObject[this.loopCount].interval = setInterval(() => {
      this.count();
    }, 1000);

  }
  totalTimeFun() {
    clearInterval(this.time);
    this.display = 0;
    this.time= setInterval(() => {
      this.totalTimeFunCount();
    }, 1000);

  }
  totalTimeFunCount(){
    this.minit=Math.floor(this.display/60);
    this.sec=this.display%60;
    this.display++;
  }
  count() {
    this.answereObject[this.loopCount].display++;
  }

  // -----------Finish exam start --------------
  finishExam (){
    this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] = this.answereObject[this.loopCount].timeArray[this.answereObject[this.loopCount].currentPage - 1] + this.answereObject[this.loopCount].display;
    // this.timeFun();
    console.log("??????????????????", this.answereObject)
    this.exitExamAlertConfirm();
  }
  // -----------Finish exam end --------------

  // -----------Aleart section start-------------
  async exitExamAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Finish Test',
      message: 'Are you sure you want to submit the test?',
      cssClass: 'custom-alert',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {}
      }, {
        text: 'Yes',
        handler: () => {
          console.log('Exam finish');
          this.submitAnswer();
        }
      }]
    });
  
    await alert.present();
  }
  // -----------Aleart section end-------------

  // ------------ Submit exam start------------
  onSubmit(form:NgForm){
    console.log("add form submit >", form.value);

    // get form value
    let fd = new FormData();

    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    // for (let questionId = 0; questionId < this.loopData.length; questionId++) {
      
        // console.log('id', 'radio_'+this.loopData[questionId].id);
        
      for (let subjectAnswer = 0; subjectAnswer < this.answereObject.length; subjectAnswer++) {
        // for (let questionAns = 0; questionAns < this.answereObject[subjectAnswer].answeredArray.length; questionAns++) {
          for (let questionTime = 0; questionTime < this.answereObject[subjectAnswer].answeredArray.length; questionTime++) {
            // if(this.loopData[questionTime].type == 'Single' || this.loopData[questionTime].type == 'Descriptive'){
              if(this.answereObject[subjectAnswer].timeArray[questionTime]=="0"){
                fd.append('time_taken_'+this.loopData[questionTime].id,"");
              }else{
                fd.append('time_taken_'+this.loopData[questionTime].id, this.answereObject[subjectAnswer].timeArray[questionTime]);
                if(this.loopData[questionTime].type == 'Single') { 
                  fd.append('radio_'+this.loopData[questionTime].id, String.fromCharCode(65+parseInt(this.answereObject[subjectAnswer].answeredArray[questionTime])));
                }else if(this.loopData[questionTime].type == 'Multiple') {
                  for(let i=0;i<this.answereObject[subjectAnswer].answeredArray[questionTime].length;i++){
                    fd.append('checkbox_'+String.fromCharCode(65+parseInt(this.answereObject[subjectAnswer].answeredArray[questionTime].split("")[i]))+'_'+this.loopData[questionTime].id, String.fromCharCode(65+parseInt(this.answereObject[subjectAnswer].answeredArray[questionTime].split("")[i])));
                  }
                }else if(this.loopData[questionTime].type == 'Descriptive') {
                  fd.append('descriptive_'+this.loopData[questionTime].id, this.answereObject[subjectAnswer].answeredArray[questionTime]);
                }
              }


              /*question type name start*/
             
              /*question type name end*/


            // }else if(this.loopData[questionTime].type == 'Multiple'){

            // }
          }
        // }
      }
    // }
    
    fd.append('exam_id', this.parms_action_id);
    fd.append('center_id', this.get_user_dtls.user_info.center_id);
    fd.append('student_id', this.get_user_dtls.user_info.student_id);
    console.log('value >', fd);

    if(!form.valid){
      return;
    }

    this.totalQuestionAnswer = fd;
    console.log('totalQuestionAnswer >', this.totalQuestionAnswer);
  }

  submitAnswer() {
    this.formSubmitSubscribe = this.http.post("test_submit.php", this.totalQuestionAnswer).subscribe(
      (response:any) => {

        console.log("add form response >", response);

        if(response.return_status > 0){

          
          this.commonUtils.presentToast('success', response.return_message);
          this.loadingController
          .create({ 
            keyboardClose: true, 
            message: 'The examination report is preparing. We will redirect you to the REPORT LIST page after the report is evaluated successfully.',
            spinner: "bubbles",
            cssClass: 'custom-loading',
          })
          .then(loadingEl => {
            loadingEl.present();

            this.interval = setInterval(() => {
              if(this.timeLeft > 0) {
                this.timeLeft--;
              } else {
                this.pauseTimer();
                // this.router.navigate(['/exam-report']);
                this.router.navigateByUrl(`report-list/${this.parms_action_id}`);
                loadingEl.dismiss();
              }
            },1000)

          });
          
        }else{

        }
      },
      errRes => {
        
      }
    );
  }
  // ------------ Submit exam end------------

  pauseTimer() {
    clearInterval(this.interval);
  }
  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if (this.userInfoDataSubscribe !== undefined) {
      this.userInfoDataSubscribe.unsubscribe();
    }
    if (this.viewPageDataSubscribe !== undefined) {
      this.viewPageDataSubscribe.unsubscribe();
    }
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
  }
  // destroy subscription end



}
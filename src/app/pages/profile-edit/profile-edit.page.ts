import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';
import { CommonUtils } from '../../services/common-utils/common-utils';
import{ AppComponent } from'../../app.component';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})

export class ProfileEditPage implements OnInit {

  isLoading = false;
  userInfoLoading;

  isLogin = true;
  userTypes;
  model:any = {};

  private userInfoDataSubscribe: Subscription;

  constructor( 
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private storage: Storage,
    private appComponent: AppComponent,
    private activatedRoute : ActivatedRoute,
  ) { }

  /*Variable Names*/
  private formSubmitSubscribe: Subscription;
  private viewPageDataSubscribe: Subscription;
  form_submit_text = 'Submit';
  form_api;
  parms_action_name;
  parms_action_id;
  get_user_dtls;
  identifier = 'member';
  listing_view_url;
  viewLoadData;
  pageData;
  viewData;
  genderArry;
  stateList;
  cityList;
  categoryList;
  selectLoadingDepend = false;
  file_url = environment.fileUrl;
  main_url = environment.apiUrl;
  

ngOnInit() {
    this.commonInfo();
}
commonInfo(){
  this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
	
    // menu hide
    // this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      console.log('auth res >>>>>>>>', res);
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          // this.router.navigateByUrl('/dashboard');
        }
      }
    });

  // user info data get
  this.userInfoDate();
}

// User info fetch start
userInfoDate() {
  this.userInfoLoading = true;
  this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
    console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
    if(res){
      this.get_user_dtls = res;
      console.log('dashboard userinfo',this.get_user_dtls);
      this.userInfoLoading = false;
      this.model = {
        student_name : res.user_info.student_name,
        student_id : res.user_info.student_id,
        center_id : res.user_info.center_id,
        student_mname : res.user_info.student_mname,
        student_lname : res.user_info.student_lname,
        category_id : res.user_info.category_id,
        student_father : res.user_info.student_father,
        student_father_mname : res.user_info.student_father_mname,
        student_father_lname : res.user_info.student_father_lname,
        student_mother : res.user_info.student_mother,
        student_mother_mname : res.user_info.student_mother_mname,
        student_mother_lname : res.user_info.student_mother_lname,
        student_dob : res.user_info.student_dob,
        student_address : res.user_info.student_address,
        student_address_line2 : res.user_info.student_address_line2,
        state : res.user_info.state,
        city : res.user_info.city,
        pin : res.user_info.pin,
        student_phone : res.user_info.student_phone,
        student_email : res.user_info.student_email,
        username : res.user_info.user_name,
        admin : res.user_info.admin,
        subject_name : res.user_info.subject_name,
        message : res.user_info.message,
        media_file : res.user_info.studentlogo,
        studentlogo : res.user_info.studentlogo,
      };
      this.stateList = res.state;
      this.categoryList = res.category;
    }else{
      this.get_user_dtls = '';
      this.userInfoLoading = false;
    }
  });
}
// User info fetch end

  ionViewWillEnter() {

    this.commonInfo();
  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  // radiobutton change
	radioButtonChange(_val){
		console.log('radio button change value >', _val);
	}

  onChangeLocation(_item, _identifire, colon_item){
    let identy;
    if(_identifire == 'state'){
      identy = 'getstate';

      colon_item.state_id = null;
      colon_item.city_id = null;

      /* this.model.pages_address.forEach(element => {
        if(element.country_id == _item){
          colon_item.state_id = null;
          colon_item.city_id = null;
        }
      }); */
    }else{
      identy = 'getcity';
      colon_item.city_id = null;
    }
    this.contactByCompany(_item,  identy, colon_item);
  }
  //contactByCompany
  contactByCompany = function( _id , _name, _colon_item){

    this.selectLoadingDepend = true;
    this.contactByCompanySubscribe = this.http.get('find_city.php?state_name='+_id).subscribe(
      (res:any) => {
        this.selectLoadingDepend = false;
        if(res.return_status > 0){

          if(_name == 'getstate'){
            this.stateList = res.return_data.state;
          }else{
            this.cityList = res.return_data.city;
          }
        }
    },
    errRes => {
      this.selectLoadingDepend = false;
    }
    );
  }
  	// ionic date picker
	pickDate(_item, _identifire){
		console.log("pickTime _item >>>>>>>>>.", _item);
		if(_identifire == 'startDate'){
		this.model.dob = moment(_item).format("YYYY-MM-DD");
		this.model.end_date = '';
		}else if(_identifire == 'endDate'){
		this.model.end_date = moment(_item).format("YYYY-MM-DD");
		}
	
		// two dates difference in number of days
		if(this.model.dob && this.model.end_date){
		let startDate = moment(this.model.dob, "YYYY-MM-DD");
		let endDate = moment(this.model.end_date, "YYYY-MM-DD");
		
		this.model.no_of_days = endDate.diff(startDate, 'days');
		}
	
	}

	// clear form item
	clearItem(_identifire, _item){
		if(_identifire == 'dob'){
		this.model.dob = '';
		this.model.end_date = '';
		}else if(_identifire == 'end_date'){
		this.model.end_date = '';
		}
  }
  
  // Normal file upload
  fileValstudentlogo;
  fileValstudentlogoCross;
  normalFileNamestudentlogo;
  imgaePreviewstudentlogo;
  uploadstudentlogoPathShow = false;
  fileValResume;
  fileValprofile;
  fileValprofileCross;
  fileValResumeCross;
  normalFileNameResume;
  normalFileNameProfile;
  uploadImagePathShow = false;
  uploadresumePathShow = false;
  imgaePreview;
  normalFileUpload(event, _item, _name) {
    console.log('nomal file upload _item => ', _item);
    console.log('nomal file upload _name => ', _name);

    if(_name == 'resume'){
      this.fileValResume =  event.target.files[0];
      _item =  event.target.files[0].name;
      this.normalFileNameResume = _name;
      this.uploadresumePathShow = true;
    }else if(_name == 'studentlogo'){
      this.fileValstudentlogo =  event.target.files[0];
  
      const renderstudentlogo = new FileReader();
      renderstudentlogo.onload = () =>{
        this.imgaePreviewstudentlogo = renderstudentlogo.result;
        console.log('this.imgaePreview >>', this.imgaePreviewstudentlogo);
      }
      renderstudentlogo.readAsDataURL(this.fileValstudentlogo);
  
      _item =  event.target.files[0].name;
      this.normalFileNamestudentlogo = _name;
      this.uploadstudentlogoPathShow = true;
    }else{
      this.fileValprofile =  event.target.files[0];

      const render = new FileReader();
      render.onload = () =>{
        this.imgaePreview = render.result;
        // console.log('this.imgaePreview >>', this.imgaePreview);
      }
      render.readAsDataURL(this.fileValprofile);

      _item =  event.target.files[0].name;
      this.normalFileNameProfile = _name;
      this.uploadImagePathShow = true;
    }
  }
  fileCross(_item, _identifire){
    if(_identifire == 'resume'){
      this.model.resume = null;
      this.model.resume2 = null;
      this.normalFileNameResume = '';
      this.fileValResumeCross = 'cross_resume';

    }if(_identifire == 'studentlogo'){
      this.model.studentlogo = null;
      this.model.studentlogo2 = null;
      this.normalFileNamestudentlogo = '';
      this.fileValstudentlogoCross = 'cross_studentlogo';
      this.uploadstudentlogoPathShow = false;
    }else{
      this.model.image = null;
      this.model.image2 = null;
      this.normalFileNameProfile = '';
      this.fileValprofileCross = 'cross_image';
      this.uploadImagePathShow = false;
    }
  }
  // Normal file upload end

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        this.pageData = res.return_data;

        this.model = {
          fname : res.return_data.fname,
          lname : res.return_data.lname,
          mobile : res.return_data.mobile,
          pin : res.return_data.pin,
          email : res.return_data.email,
          password : res.return_data.password,
          gender : res.return_data.gender,
          dob : res.return_data.dob,
          father_name : res.return_data.father_name,
          image : res.return_data.image,
          resume : res.return_data.resume,
          nationality : res.return_data.nationality,
          religion : res.return_data.religion,
          adhar_no : res.return_data.adhar_no,
          occupation : res.return_data.occupation,
          address_1 : res.return_data.address_1,
          address_2 : res.return_data.address_2,
          username : res.return_data.username,
          approve : res.return_data.approve,
          role_id : res.return_data.user_type,
          status : true
        };

        /* Dynamic send hidden value */
        if(this.pageData.approve == 0 ) {
          this.model.approve = false;
        }else {
          this.model.approve = true;
        }
        // gender selected
        this.genderArry = res.return_data.gender_arr;
        console.log('this.genderArry', this.genderArry);
        if(res.return_data.gender_arr){
          res.return_data.gender_arr.forEach(element => {
          element.gender = res.return_data.gender;
          });
        }

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

  // ======================== form submit start ===================
	  clickButtonTypeCheck = '';
	  form_submit_text_save = 'Save';
	  form_submit_text_save_another = 'Save & Add Another' ;

	  // click button type 
	  clickButtonType( _buttonType ){
	    this.clickButtonTypeCheck = _buttonType;
	  }

	  onSubmit(form:NgForm){
	    console.log("add form submit >", form.value);
	    
	    if(this.clickButtonTypeCheck == 'Save'){
	      this.form_submit_text_save = 'Submitting';
	    }else{
	      this.form_submit_text_save_another = 'Submitting';
	    }

	    this.form_submit_text = 'Submitting';

	    // get form value
      let fd = new FormData();
      
      // fileValprofile

      if(this.fileValstudentlogo) {
        fd.append(this.normalFileNamestudentlogo, this.fileValstudentlogo, this.fileValstudentlogo.name);
      }else if(this.fileValstudentlogoCross == 'cross_studentlogo'){
        fd.append('studentlogo', 'removed');
      }else{
        fd.append('studentlogo', '');
      }
    

	    for (let val in form.value) {
	      if(form.value[val] == undefined){
	        form.value[val] = '';
	      }
	      fd.append(val, form.value[val]);
	    };

	    console.log('value >', fd);

	    if(!form.valid){
	      return;
	    }

	    this.formSubmitSubscribe = this.http.post("profile_edit.php", fd).subscribe(
	      (response:any) => {

	        if(this.clickButtonTypeCheck == 'Save'){
	          this.form_submit_text_save = 'Save';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }

	        // this.authService.getTokenSessionMaster();

	        console.log("add form response >", response);

	        if(response.return_status > 0){

            this.form_submit_text = 'Submit';
            
            this.appComponent.userInfoData();
	          
            //   this.router.navigateByUrl(`choose-duration`);
            console.log('this.identifier', this.identifier);
            this.router.navigateByUrl(`profile-details`);
			  
			  
			  
	          // user details set
	          if(this.get_user_dtls){
	            this.commonUtils.onClicksigninCheck(this.get_user_dtls);
	          }
	          // this.commonUtils.presentToast(response.return_message);
	          this.commonUtils.presentToast('success', response.return_message);

	          if(this.clickButtonTypeCheck == 'Save'){

	            // this.router.navigate(['/student-list']);

	          }

	          // this.notifier.notify( type, 'aa' );
	    
	          if( this.parms_action_name == 'add'){
	            // form.reset();
	            this.model = {};
	            this.model = {
	              enable : 'true',
	              sms: 'true',
	              emailcheck: 'true'
	            };
	          }
	          
	        }else{
	          this.form_submit_text = 'Submit';
	        }
	      },
	      errRes => {
	        if(this.clickButtonTypeCheck == 'Save'){
	          this.form_submit_text_save = 'Save';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }
	        this.form_submit_text = 'Submit';
	      }
	    );

	  }
	// form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }

    // ----------- destroy subscription start ---------
		ngOnDestroy() {
			if(this.formSubmitSubscribe !== undefined){
			  	this.formSubmitSubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.userInfoDataSubscribe !== undefined){
        this.userInfoDataSubscribe.unsubscribe();
      }
		}
	// destroy subscription end


}
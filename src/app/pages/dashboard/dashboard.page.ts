import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController, MenuController, Platform, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonUtils } from './../../services/common-utils/common-utils';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTreeNestedDataSource } from '@angular/material';
import { NestedTreeControl } from '@angular/cdk/tree';
import { environment } from 'src/environments/environment';
import { AddCommonModelPage } from '../modal/add-common-model/add-common-model.page';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';

interface exam {
  name: string;
  childitem?: exam[];
}

// const TREE_DATA: FoodNode[] = [
//   {
//     name: 'Fruit',
//     children: [
//       {name: 'Apple'},
//       {name: 'Banana'},
//       {name: 'Fruit loops'},
//     ]
//   },
//   {
//     name: 'Vegetables',
//     children: [
//       {
//         name: 'Green',
//         children: [
//           {name: 'Broccoli'},
//           {name: 'Brussels sprouts'},
//         ]
//       }, 
//       {
//         name: 'Orange',
//         children: [
//           {name: 'Pumpkins'},
//           {name: 'Carrots'},
//         ]
//       },
//     ]
//   },
// ];

// console.log('TREE_DATA', TREE_DATA);


/* tslint:disable */ 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  /*Veriable*/
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;
  private viewPageDataSubscribe: Subscription;
  private requestEmailDataSubscribe: Subscription;
  private contactByCompanySubscribe: Subscription;
  private formSubmitSubscribe: Subscription;
  userInfoLoading;
  get_user_dtls;
  listing_view_url;
  request_email_url;
  viewLoadData;
  pageData;
  viewData;
  genderArry;
  gps_button;
  exam_tree;
  treeControl;
  dataSource;
  panelOpenState = false;
  selectLoadingDepend = false;
  model:any = {};
  stateList;
  cityList;
  categoryList;
  adminList;
  form_submit_text = 'Update';
  formUrl;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{},
  ]

  

  private userInfoDataSubscribe: Subscription;

  constructor(
    public menuCtrl: MenuController,
    private commonUtils : CommonUtils,
    private http : HttpClient,
    private router : Router,
    private platform : Platform,
    private modalController : ModalController,
    private appComponent: AppComponent,
  ) { 
  }

  hasChild = (_: number, node: exam) => !!node.childitem && node.childitem.length > 0;    

  ngOnInit() {

    // view page url name
    this.listing_view_url = 'test_dashboard.php';
    // this.listing_view_url = 'report_dashboard.php';

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
          media_file : res.user_info.media_file,
          studentlogo : res.user_info.studentlogo,
        };
        this.stateList = res.state;
        this.categoryList = res.category;
        this.adminList = res.admin;
      }else{
        this.get_user_dtls = '';
        this.userInfoLoading = false;
      }
    });
  }
  // User info fetch end

  changeTab(_url) {
    console.log('Clicked', _url);
    this.listing_view_url = _url;
    if(_url == 'profile.php'){
      this.form_submit_text = 'Update Profile';
      this.formUrl = 'profile_edit.php';
    }else if(_url == 'changePassword.php') {
      this.formUrl = 'change_password.php'
      this.form_submit_text = 'Update Password';
    }else if(_url == 'contact.php') {
      this.formUrl = 'contact.php'
      this.form_submit_text = 'Send Mail';
    }else {
      this.viewPageData();
    }
    this.userInfoDate();
    
    
  }

  ionViewWillEnter() {

    // menu show
    this.menuCtrl.enable(true);
  }

  // Normal file upload
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

    }else if(_identifire == 'studentlogo'){
      this.model.studentlogo = null;
      this.model.studentlogo2 = null;
      this.normalFileNameProfile = '';
      this.fileValprofileCross = 'cross_image';
      this.uploadImagePathShow = false;
    }else{
      this.model.media_file = null;
      this.model.media_file2 = null;
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
    console.log('dashboard userinfo',this.get_user_dtls);
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        
        this.pageData = res.return_data;

        this.exam_tree = res.return_data.exam;

        // For Tree structure
        this.treeControl = new NestedTreeControl<exam>(node => node.childitem);
        this.dataSource = new MatTreeNestedDataSource<exam>();

        this.dataSource.data = this.exam_tree;

        console.log('this.exam_tree', this.exam_tree);
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

  // Download pdf start
  downloadPdf(_id){

    console.log('id', _id);
    // location.href = this.main_url+'/report_download.php?exam_id='+this.parms_action_exam_id+'&exam_date='+this.parms_action_exam_date+'&student_id='+this.get_user_dtls.student_id+'&exam_date='+this.parms_action_exam_date+'&center_id='+this.parms_action_center_id;
    window.open(this.main_url+'/purchased_order_download.php?order_id='+_id, "_blank");
  }
  // Download pdf end

  // Order email start
  orderEmail(_orderId){
    console.log('_orderId', _orderId);
    // Request email url
    this.request_email_url = 'purchased_order.php?action=send_email&student_id='+this.get_user_dtls.user_info.student_id+'&order_id='+_orderId+'&center_id='+this.get_user_dtls.user_info.center_id;
    this.requestEmailDataSubscribe = this.http.get(this.request_email_url).subscribe(
      (res:any) => {
        if(res.return_status > 0){
          this.commonUtils.presentToast('success', res.return_message);
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // Order email end

  // deleteNotice start
  deleteNotice(_orderId){
    console.log('_orderId', _orderId);
    // Request email url
    this.request_email_url = 'notice.php?action=notice_delete&student_id='+this.get_user_dtls.user_info.student_id+'&n_id='+_orderId;
    this.requestEmailDataSubscribe = this.http.get(this.request_email_url).subscribe(
      (res:any) => {
        if(res.return_status > 0){
          this.commonUtils.presentToast('success', res.return_message);
          this.viewPageData();
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // deleteNotice end

  // ..... change Password modal start ......
  async OpenModal(_identifier, _item, _items) {
    // console.log('_identifier >>', _identifier);
    let open_modal;
    if(_identifier == 'change_password_modal'){
      open_modal = await this.modalController.create({
        component: AddCommonModelPage,
        cssClass: 'mymodalClass',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items
        }
      });
    }else if(_identifier == 'generate_refund_modal'){
      open_modal = await this.modalController.create({
        component: AddCommonModelPage,
        cssClass: 'mymodalClass',
        componentProps: { 
          identifier: _identifier,
          modalForm_item: _item,
          modalForm_array: _items
        }
      });
    }
    
    // modal data back to Component
    open_modal.onDidDismiss()
    .then((getdata) => {
      // console.log('getdata >>>>>>>>>>>', getdata);
      if(getdata.data == 'submitClose'){
        /* this.onListData(this.listing_url, this.displayRecord, this.pageNo, this.api_parms, this.searchTerm, this.cherecterSearchTerm, this.sortColumnName, this.sortOrderName, this.advanceSearchParms, this.urlIdentifire);  */
      }

    });

    return await open_modal.present();
  }
  // change Password   modal end 

  // Select status start
  selectStatus(_item, _identifire){
    console.log("selectStatus _item >>>>>>>>>.", _item);
    console.log("selectStatus _identifire >>>>>>>>>.", _identifire);
  }
  // Select status end

  // ionic date picker
	pickDate(_item, _identifire){
		console.log("pickTime _item >>>>>>>>>.", _item);
		if(_identifire == 'startDate'){
		this.model.student_dob = moment(_item).format("DD-MM-YYYY");
		this.model.end_date = '';
		}else if(_identifire == 'endDate'){
		this.model.end_date = moment(_item).format("MM/DD/YYYY");
		}else if(_identifire == 'date_from'){
      this.model.date_from = moment(_item).format("MM/DD/YYYY");
    }else if(_identifire == 'date_to'){
      this.model.date_to = moment(_item).format("MM/DD/YYYY");
    }
	
		// two dates difference in number of days
		if(this.model.student_dob ){
		let startDate = moment(this.model.student_dob, "DD-MM-YYYY");
		let endDate = moment(this.model.end_date, "DD-MM-YYYY");
		
		this.model.no_of_days = endDate.diff(startDate, 'days');
		}
	
	}

  // clear form item
	clearItem(_identifire, _item){
		if(_identifire == 'student_dob'){
		this.model.student_dob = '';
		this.model.end_date = '';
		}else if(_identifire == 'end_date'){
		this.model.end_date = '';
		}else if(_identifire == 'date_from'){
      this.model.date_from = '';
    }else if(_identifire == 'date_to'){
      this.model.date_to = '';
    }
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

  //------- advance search -------
  // OPen search panel
  status: boolean = false;
  clickEvent(){
      this.status = !this.status;       
  }

  advanceSearchParms ;
  searchItem;
  onSubmitAdvanceForm(form:NgForm){

    // get form value
    let fd = new FormData();

    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('value >', fd);
    this.formSubmitSubscribe = this.http.post(this.listing_view_url, fd).subscribe(
      (response:any) => {

        console.log("add form response >", response);
        if(response.return_status > 0) {
          this.pageData = response.return_data;
          this.commonUtils.presentToast('success', response.return_message);
        }
        
      },
      errRes => {

      }
    );



    // this.searchItem = _identifier+'?';
    // this.advanceSearchParms = form.value;
    // console.log('advanceSearchParmsvalue >>', this.advanceSearchParms);
    // for(let item in this.advanceSearchParms){
    //   if(this.advanceSearchParms[item] == undefined){
    //     this.advanceSearchParms[item] = '';
    //   }
    //   this.searchItem = this.searchItem + '&'+item+'='+this.advanceSearchParms[item];
    // }
    // console.log('searchItem>>', this.searchItem);
    // this.listing_view_url = this.searchItem;


    // this.viewPageData();
  }
  // Clear advance search data
  clearSearchData() {
    this.viewPageData();
    this.clickEvent();
  }
  // advance search end

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
    if(this.fileValprofile) {
      // normal file upload
      fd.append(this.normalFileNameProfile, this.fileValprofile, this.fileValprofile.name);
    }else if(this.fileValprofileCross == 'cross_image'){
      fd.append('media_file', 'removed');
    }else{
      fd.append('media_file', '');
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

    this.formSubmitSubscribe = this.http.post(this.formUrl, fd).subscribe(
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
          // this.router.navigateByUrl(`profile-details/${this.parms_action_id}`);
      
      
      
          // user details set
          if(this.get_user_dtls){
            this.commonUtils.onClicksigninCheck(this.get_user_dtls);
          }
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if(this.clickButtonTypeCheck == 'Save'){

            // this.router.navigate(['/student-list']);

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
  

  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.userInfoDataSubscribe !== undefined){
        this.userInfoDataSubscribe.unsubscribe();
      }
      if(this.contactByCompanySubscribe !== undefined){
        this.contactByCompanySubscribe.unsubscribe();
      }
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.requestEmailDataSubscribe !== undefined){
        this.requestEmailDataSubscribe.unsubscribe();
      }
      if(this.formSubmitSubscribe !== undefined){
        this.formSubmitSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}

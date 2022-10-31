import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../services/auth/auth.service';
import { CommonUtils } from '../../../services/common-utils/common-utils';
import{ AppComponent } from'../../../app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  isLoading = false;
  userInfoLoading;

  isLogin = true;
  userTypes;
  model:any = {};
  center_id;
  

  constructor( 
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private storage: Storage,
    private appComponent: AppComponent
  ) { }

  /*Variable Names*/
  private formSubmitSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  form_submit_text = 'Register';
  form_api;
  parms_action_name;
  parms_action_id;
  get_user_dtls;

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      console.log('auth res >>>>>>>>', res);
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/dashboard');
        }
      }
    });

    if( this.parms_action_name == 'edit'){
	// form submit api edit
	this.form_api = 'login_register.php?action=register';

	console.log('edit data<><><><>', this.form_api);
	}else{
	// form submit api add
	this.form_api = 'login_register.php?action=register';
	console.log('edit data@@@@@@@@@@@@', this.form_api);
	}

	this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
		console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
		if(res){
		  this.get_user_dtls = res;
		  console.log('dashboard userinfo',this.get_user_dtls);
		  this.userInfoLoading = false;
		  this.center_id = res.siteinfo.center_id;
		  console.log('center_id', this.center_id);
		}else{
		  this.get_user_dtls = '';
		  this.userInfoLoading = false;
		}
	});
  }

  ionViewWillEnter() {

    // this.appComponent.userInfoData();

    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        if(res.token != undefined ){
          this.router.navigateByUrl('/dashboard');
        }
      }
    });
  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }


  // ======================== form submit start ===================
	  clickButtonTypeCheck = '';
	  form_submit_text_save = 'Register';
	  form_submit_text_save_another = 'Save & Add Another' ;

	  // click button type 
	  clickButtonType( _buttonType ){
	    this.clickButtonTypeCheck = _buttonType;
	  }

	  onSubmit(form:NgForm){
	    console.log("add form submit >", form.value);
	    
	    if(this.clickButtonTypeCheck == 'Register'){
	      this.form_submit_text_save = 'Please wait';
	    }else{
	      this.form_submit_text_save_another = 'Please wait';
	    }

	    this.form_submit_text = 'Please wait';

	    // get form value
	    let fd = new FormData();

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

	    this.formSubmitSubscribe = this.http.post("login_register.php?action=register", fd).subscribe(
	      (response:any) => {

	        if(this.clickButtonTypeCheck == 'Register'){
	          this.form_submit_text_save = 'Register';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }

	        // this.authService.getTokenSessionMaster();

	        console.log("add form llklkkresponse >", response);

	        if(response.return_status > 0){

	          this.form_submit_text = 'Register';
	          
	        //   this.router.navigateByUrl(`verification-email/${response.return_data.user_id}`);
	          
	          // user details set
	        //   if(response.return_data.user){
	        //     this.commonUtils.onClicksigninCheck(response.return_data.user);
	        //   }
	          // this.commonUtils.presentToast(response.return_message);
	          this.commonUtils.presentToast('success', response.return_message);
			  //this.router.navigate(['/register-success']);

			  let form_data = {
				email: response.return_data.username,
				password: response.return_data.password
			  };
			  let authObs: Observable<any>;
			  authObs = this.authService.login('login_register.php?action=login', form_data, '');

			  authObs.subscribe(
				resData => {
				  console.log('resData', resData);
				  if(resData.return_status == 2){
					this.router.navigateByUrl(`verification-email/${resData.return_data.user_id}`);
					console.log('verification-email', resData.return_data.user_id);
					this.commonUtils.presentToast('success', resData.return_message);
	
				  }else if(resData.return_status > 0){
					console.log('resData.return_status > 0', resData.return_status);

					this.router.navigate(['/register-success']);
	
					this.appComponent.userInfoData();
	
					console.log('user Type =============))))))))))))))>', resData.return_data.user_type);
					
				  }else{
					this.commonUtils.presentToast('error', resData.return_message[0]);
				  }
				  this.isLoading = false;
				},
				errRes => {
				}
			  );

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
	          this.form_submit_text = 'Register';
	        }
	      },
	      errRes => {
	        if(this.clickButtonTypeCheck == 'Register'){
	          this.form_submit_text_save = 'Register';
	        }else{
	          this.form_submit_text_save_another = 'Save & Add Another';
	        }
	        this.form_submit_text = 'Register';
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
			if(this.userInfoDataSubscribe !== undefined){
				this.userInfoDataSubscribe.unsubscribe();
			}
			if(this.formSubmitSubscribe !== undefined){
			  this.formSubmitSubscribe.unsubscribe();
			}
		}
	// destroy subscription end


}

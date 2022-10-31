import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, of, empty } from 'rxjs';
import { take, map, tap, delay, switchMap, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { CommonUtils } from '../../services/common-utils/common-utils';
 
const API_URL = environment.apiUrl;
const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  current_url_path_name;

  // private _globalparamsData = null;
  private _globalparamsData = new BehaviorSubject(null);

  // get token session master as observable
  get globalparamsData(){
    return this._globalparamsData.asObservable();
  }

  // get token session master as a non observable
  public getTokenSessionMaster() {
    return this._globalparamsData.value;
  }

  constructor(
    private commonUtils : CommonUtils,
    private storage: Storage, 
    private http : HttpClient,
    private router: Router
  ) { 
  }
 

  //================== auto login start ===================
    autoLogin(){
      // stroage data get
      return from(this.storage.get('setStroageGlobalParamsData')).pipe(
        map(storData => {
          console.log('storData @@@@@@@>>>>>', storData);
          if(!storData || !storData.student_id){
            return null;
          }
          const storeauth = {
            'user': storData.user,
            'student_id': storData.student_id 
          }
          return storeauth;
        }),
        tap(storeauthtication => {
          if (storeauthtication) {
            this._globalparamsData.next(storeauthtication);
          }
        }),
        map(userLog => {
          // console.log("auto login map userLog >>>", userLog);
          return !!userLog;  //return true/false(boolen value)
        })
      );
    }
  // auto login end

  //----- login check for website start------
  autoLoginWebsite(){
    let autologinObsData = from(this.storage.get('setStroageGlobalParamsData'));
    this._globalparamsData.next(autologinObsData);
    return autologinObsData;
  }
  // login check for website end
  
  // ================= login service call start ==================
    login(_url, _data, _siteInfo) {
      return this.http.post(`${_url}`, _data).pipe(
        tap(this.setGlobalParams.bind(this)) //use for response value send
      );
    }
    // ---setGlobalParams function defination----
    private setGlobalParams(resData){
      // console.log('..................set 11 >', resData);
      this._globalparamsData.next(
        {
          'user': resData.return_data.user_info,
          'student_id': resData.return_data.user_info.student_id
        }
      );

      // stroage
      this.storeAuthData(resData);
    }
    //--- storeAuthData function defination---
    private storeAuthData(_data) {
      console.log('data>>>>>>>>>>>>>>>>>>>>>>>> user_info', _data.return_data.user_info);
      console.log('data>>>>>>>>>>>>>>>>>>>>>>>> student_id', _data.return_data.user_info.student_id );
      // set stroage data
      this.storage.set('setStroageGlobalParamsData',  {
        'user': _data.return_data.user_info,
        'student_id': _data.return_data.user_info.student_id 
      });
      // Plugins.Storage.set({ key: 'authData', value: data });
    }
  //login service call end

  //======================= logout functionlity start ==============
    logout() {
      this.storage.clear().then(() => {
        console.log('all stroage data cleared');
        // this.router.navigateByUrl('/auth');

        this._globalparamsData = new BehaviorSubject(null);
  

        // working code 
        //window.location.reload(); //working

        // user details get
        // this.commonUtils.onSigninStudentInfo(empty());
        // this.commonUtils.onSigninStudentInfo(null);

        // this.router.navigateByUrl('/auth');
        this.router.navigate(['auth'], {replaceUrl: true});


      });
      // this._globalparamsData = null;
    }
  // logout functionlity end
 
}

import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from './../../services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { NgForm } from '@angular/forms';

declare var RazorpayCheckout:any;

declare var $ :any; //jquary declear

interface exam {
  name: string;
  childitem?: exam[];
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})

export class ProductDetailsPage implements OnInit {

  /*Veriable*/
  private viewPageDataSubscribe: Subscription;
  private userInfoDataSubscribe: Subscription;
  private ratingSubscribe : Subscription;
  private promocodeSubmitSubscribe : Subscription;
  userInfoLoading;
  get_user_dtls;
  file_url = environment.fileUrl;
  main_url = environment.apiUrl;
  listing_view_url;
  parms_action_id;
  viewLoadData;
  pageData;
  viewData;
  fetchItems=[];
  ratingNumber:number;
  treeControl;
  dataSource;
  exam_tree;
  paymentoptions;
  orderApi;
  razorPayId;

  // skeleton loading
  skeleton = [
    {},{},{},{},{},{},{},{},{},{}
  ]

  constructor(
    public menuCtrl: MenuController,
    private activatedRoute : ActivatedRoute,
    private commonUtils : CommonUtils,
    private http : HttpClient,
    private router:Router,
    private loadingController: LoadingController,
  ) { }

  hasChild = (_: number, node: exam) => !!node.childitem && node.childitem.length > 0;    

  ngOnInit() {
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    // menu show
    this.menuCtrl.enable(true);

    // view page url name
    this.listing_view_url = 'product_detail_page.php?product_id='+this.parms_action_id ;
    
    this.viewPageData();
    // Order Api
    this.orderApi = 'order_submit.php';

    // user info data get
    this.userInfoLoading = true;
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userInfoLoading = false;
        this.pageData = res.user_info;
        this.razorPayId = res.razor_key_id;
        console.log('this.razorPayId',this.razorPayId);
        
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
        this.ratingNumber = parseInt(res.return_data.product_rating.avg_rating, 10);;
        console.log('Rating', this.ratingNumber);
        console.log('this.viewData', this.viewData);
        // if(res.return_status > 0){
        //   this.viewData = res.return_data[this.parms_action_id];
        //   console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        // }

        // For Tree structure
        this.exam_tree = res.return_data.proceed_to_buy;
        this.treeControl = new NestedTreeControl<exam>(node => node.childitem);
        this.dataSource = new MatTreeNestedDataSource<exam>();

        this.dataSource.data = this.exam_tree;
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  // ============ Tree product amount section  start ==================
  selectedItems = [];
  gstAmount;
  roundOfAmount;
  totalAmount;
  roundOffAmount;
  totalProductAmount;
  onCheckboxChange(event, value) { 
    console.log('event',event);
    console.log('value',value);

    if(event.checked == true) {
      this.selectedItems.push(value);
    }else {
      let arrayIndex;
      for(let i = 0; i < this.selectedItems.length; i ++) {
        
        if(this.selectedItems[i].id == value.id) {
          console.log('Array index>>', i);
          arrayIndex = i;
        }
      }
      this.selectedItems.splice(arrayIndex , 1);
    }
    
    console.log('selectedItems', this.selectedItems);

    this.calculateProductAmount();
    
    // if(this.promocodeAmount > 0) {
    //   this.submitPromocodeForm();
    // }
    
  }
  // Tree product amount end

  // -------------Calculate amount start ------------
  selectedProductIds;
  calculateProductAmount() {
    // Calculate table datas start
    this.gstAmount = 0;
    this.roundOfAmount = 0;
    this.totalProductAmount = 0;
    this.roundOffAmount = 0;
    this.selectedProductIds = '';
    this.totalAmount = this.viewData.test_activation_amount - this.promocodeAmount;
    for(let i = 0; i < this.selectedItems.length; i ++) {
      this.totalAmount = this.totalAmount + this.selectedItems[i].price;
      this.totalProductAmount = this.totalProductAmount + this.selectedItems[i].price;
      if(this.selectedItems.length > 1){
        if(i > 0 && i < this.selectedItems.length){
          this.selectedProductIds = this.selectedProductIds+','+this.selectedItems[i].id;
        }else {
          this.selectedProductIds = this.selectedItems[i].id ;
        }
        
      }else{
        this.selectedProductIds = this.selectedItems[i].id;
      }

    }
    console.log('totalAmount', this.totalAmount);
    console.log('selectedProductIds', this.selectedProductIds);

    // GST calculation
    console.log('this.viewData.igst',this.viewData.igst);
    

    this.gstAmount = (this.totalAmount * this.viewData.igst)  / 100;
    console.log('gstAmount', this.gstAmount);

    this.totalAmount = this.totalAmount + this.gstAmount;

    // Calculate round off
    var roundOff = this.totalAmount - Math.floor(this.totalAmount);
    this.roundOffAmount = roundOff.toFixed(2)

    console.log('roundoff', this.roundOffAmount);
    
    this.totalAmount = this.totalAmount - this.roundOffAmount;

    console.log('totalAmount', this.totalAmount);
    console.log('totalProductAmount', this.totalProductAmount);

    if(this.promocodeAmount > 0){
      this.offerCost = this.totalProductAmount - this.promocodeAmount;
    }
    
    console.log('this.offerCost>>', this.offerCost);
    
    // Calculate table datas end
  }
  // Calculate amount end


  //---- rating click function call  start ----
  ratingClicked: number;
  ratingComponentClick(clickObj: any, _link): void {
    console.log('clickObj >>', clickObj);
    console.log('click_link >>', _link);
    const item = this.fetchItems.find(((i: any) => i.id === clickObj.itemId));
    if (!!item) {
      item.rating = clickObj.rating;
    }

    this.ratingSubscribe = this.http.post(_link+'?product_id='+this.parms_action_id+'&identifier=student&rating_value='+clickObj.rating,'rating').subscribe(
    (res:any) => {
      if(res.return_status > 0){

        this.commonUtils.presentToast('success', res.return_message);
      }else{
        this.commonUtils.presentToast('error', res.return_message);
      }
    }); 
  }
  // --rating click function call  end--

  // ------- Promocode start ------------
  promocode = '';
  offerCost = 0;
  promocodeAmount = 0;
  promoLoading = false;
  submitPromocodeForm(form:NgForm){
    this.promoLoading = true;
    this.promocodeAmount = 0;
    console.log('promocode', this.promocode);
    
    this.promocodeSubmitSubscribe = this.http.post('promocode_validation.php?promocode='+this.promocode,'').subscribe(
      (response:any) => {
        this.promoLoading = false;
        console.log('response promocode>>', response);
        if(response.return_status > 0){
          this.commonUtils.presentToast('success', response.return_message);
          if(response.return_data.type == 'percentile'){
            this.promocodeAmount = (this.totalProductAmount * response.return_data.value)  / 100;
            console.log('promocodeAmount', this.promocodeAmount);
          }else if(response.return_data.type == 'fixed') {
            this.promocodeAmount =  response.return_data.value;
          }
        }
        this.calculateProductAmount();
      },
      errRes => {
        this.promoLoading = false;
      }
    );
  }
  // Promocode end

  // openPromocode = false;
  // promocodeOpen() {
  //   if(this.openPromocode == true){
  //     this.openPromocode = false;
  //   }else {
  //     this.openPromocode = true;
  //   }
  // }

  // ----------------- Payment start ----------------
  paymentProduct(){
    this.loadingController
				.create({ 
					spinner: "lines",
					message: 'Please wait...',
					cssClass: 'custom-loading',
				 })
				.then(loadingEl => {
					loadingEl.present();
					// RazorpayCheckout.open(this.paymentoptions, successCallback, cancelCallback);
					// -----------------razorpay payment getwat call start-------------------
					
					var paymentSucessVariable = 0;
					this.paymentoptions = {
						description: 'Payment',
						// image: 'https://i.imgur.com/3g7nmJC.png',
						currency: "INR", // your 3 letter currency code
						key: this.razorPayId, // your Key Id from Razorpay dashboard
						amount: this.totalAmount * 100, // Payment amount in smallest denomiation e.g. cents for USD
						name: 'Innovintent Education',
						prefill: {
							"name": this.pageData.student_name + this.pageData.student_mname + this.pageData.student_lname,
							"email": this.pageData.student_email,
							"contact": this.pageData.student_phone
						},
						notes: {
							"address": this.pageData.student_address
						},
						theme: {
							color: '#011842'
						},
						modal: {
							ondismiss: function () {
							alert('dismissed')
							loadingEl.dismiss();
							}
						}
					};

					var successCallback = (payment_id) => {

            console.log('successCallback',payment_id);
            // off start
						
            this.http.get(this.orderApi+'?razorpay_payment_id='+payment_id+'&merchant_order_id=1&merchant_surl_id=&merchant_furl_id=&card_holder_name_id='+this.pageData.student_name +' '+ this.pageData.student_mname  +' '+ this.pageData.student_lname+'&merchant_total='+this.totalProductAmount+'&merchant_amount='+this.totalAmount+'&currency_code_id=INR&product_id='+this.parms_action_id+'&user_id='+this.pageData.student_id+'&purchased_order_extension='+this.selectedProductIds+'&total_price='+this.totalAmount+'&product_cost='+this.totalProductAmount+'&offer_cost='+this.offerCost+'&promocode_cost='+ this.promocodeAmount+'&test_activation_amount='+this.viewData.test_activation_amount+'&cgst='+this.viewData.cgst+'&sgst='+this.viewData.sgst+'&igst='+this.viewData.igst+'&round_off_value='+this.roundOffAmount+'&total_after_offer_promo_testActivation='+this.totalAmount+'&identifier=student&applied_promocode='+this.promocode).subscribe(
              (res:any) => {
                loadingEl.dismiss();
                console.log('payment_id res>>', res);
        
                if(res.return_status == 1){
                  this.router.navigateByUrl(`order-status/${res.order_id}`);
                }else {
                  this.router.navigateByUrl(`order-status/1`);
                }
                
              },
              errRes => {
              }
            );
            // off end
						
						
					};

						var cancelCallback = function (error) {
							loadingEl.dismiss();
							// alert(error.description + ' (Error ' + error.code + ')');
						};
						
				
				
            RazorpayCheckout.on(this.paymentoptions, successCallback, cancelCallback);
            RazorpayCheckout.open(this.paymentoptions, successCallback, cancelCallback);
				});
  }
  // Payment end

  // Checking order start
  // orderSubmit(){
  //   this.http.get(this.orderApi+'?razorpay_payment_id=12345678&merchant_order_id=1&merchant_surl_id=&merchant_furl_id=&card_holder_name_id='+this.pageData.student_name +' '+ this.pageData.student_mname  +' '+ this.pageData.student_lname+'&merchant_total='+this.totalProductAmount+'&merchant_amount='+this.totalAmount+'&currency_code_id=INR&product_id='+this.parms_action_id+'&user_id='+this.pageData.student_id+'&purchased_order_extension='+this.selectedProductIds+'&total_price='+this.totalAmount+'&product_cost='+this.totalProductAmount+'&offer_cost='+this.offerCost+'&promocode_cost='+ this.promocodeAmount+'&test_activation_amount='+this.viewData.test_activation_amount+'&cgst='+this.viewData.cgst+'&sgst='+this.viewData.sgst+'&igst='+this.viewData.igst+'&round_off_value='+this.roundOffAmount+'&total_after_offer_promo_testActivation='+this.totalAmount+'&identifier=student&applied_promocode='+this.promocode).subscribe(
  //     (res:any) => {
  //       console.log('payment_id res>>', res);

  //       if(res.return_status == 1){
  //         this.router.navigateByUrl(`order-status/${res.order_id}`);
  //       }else {
  //         this.router.navigateByUrl(`order-status/1`);
  //       }
        
  //     },
  //     errRes => {
  //     }
  //   );
  // }


  // ----------- destroy subscription start ---------
    ngOnDestroy() {
      if(this.viewPageDataSubscribe !== undefined){
        this.viewPageDataSubscribe.unsubscribe();
      }
      if(this.userInfoDataSubscribe !== undefined){
        this.userInfoDataSubscribe.unsubscribe();
      }
      if(this.ratingSubscribe !== undefined){
        this.ratingSubscribe.unsubscribe();
      }
      if(this.promocodeSubmitSubscribe !== undefined){
        this.promocodeSubmitSubscribe.unsubscribe();
      }
    }
  // destroy subscription end

}
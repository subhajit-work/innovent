/* tslint:disable */ 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { IonicTimepickerModule } from '@logisticinfotech/ionic-timepicker';

import { MatExpansionModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatSortModule, MatFormFieldModule, MatSelectModule,
  MatAutocompleteModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatRippleModule, MatTabsModule, MatTreeModule, MatStepperModule, MatInputModule
} from '@angular/material';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxTinymceModule } from 'ngx-tinymce';


import { HighlightDirective } from '../directives/directive.directive';
import { CommonHeaderComponent } from '../my-component/common-header/common-header.component';
import { CommonFooterComponent } from '../my-component/common-footer/common-footer.component';
import { RatingComponent } from '../my-component/rating/rating.component';
import { FiltermultiPipe } from '../pipe/filter.pipe';
import { RoundPipe } from '../pipe/roundof.pipe ';
import { DragDropDirective } from '../directives/file-upload.directive';
import { FileSizePipeConvertPipe } from '../pipe/fileSize-convert.pipe ';
import { SafeUrlPipe } from '../pipe/safeUrl.pipe ';
import { MyTooltipDirective } from '../directives/my-tooltip.directive';
import { OnlyNumberDirective } from '../directives/only-number.directive';
import { AutofocusDirective } from '../directives/input-auto-focus.directive';
import { NgInitDirective } from '../directives/init.directive';
import { MustMatchDirective } from '../directives/must-match.directive';

import { AutocompleteModule } from 'ng2-input-autocomplete'; // Import autocomplte library (npm install ng2-input-autocomplete --save

import { SlickCarouselModule } from 'ngx-slick-carousel'; //angular slick sider

import { SafeHtmlPipe } from '../pipe/safe-html.pipe';

@NgModule({
  declarations: [
    HighlightDirective, //directive share
    CommonHeaderComponent, //header component share
    CommonFooterComponent,  //footer component share
    RatingComponent, //rating component share
    FiltermultiPipe, // custom filter multiple value
    DragDropDirective, //file upload directive
    FileSizePipeConvertPipe, //file size convert pipe/filter
    MyTooltipDirective, //not ues any where
    OnlyNumberDirective, // take only number
    AutofocusDirective,
    RoundPipe,
    SafeUrlPipe,
    NgInitDirective,
    SafeHtmlPipe,
    MustMatchDirective //match password or confirm password or email or confirm passwor
  ],
  imports: [
    CommonModule,
    IonicModule, //need for component share only
    MatRippleModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatTabsModule,
    MatStepperModule,
    MatInputModule ,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    //NgMultiSelectDropDownModule.forRoot(), //not need any where
    Ionic4DatepickerModule,
    IonicTimepickerModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    NgSelectModule, //angular dropdown
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
    }),
    SlickCarouselModule, //angular slick slider
    AutocompleteModule.forRoot(), //autocomplite module
  ],
  providers: [
    
  ],
  exports:[
    HighlightDirective, 
    MatRippleModule,
    MatExpansionModule, 
    MatMenuModule, 
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatStepperModule,
    MatInputModule ,
    MatAutocompleteModule,
    CommonHeaderComponent, //header component share
    CommonFooterComponent,  //footer component share
    RatingComponent, //rating component share
    ReactiveFormsModule,
    FormsModule,
    //NgMultiSelectDropDownModule, //not need any where
    Ionic4DatepickerModule,
    IonicTimepickerModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule,
    FiltermultiPipe, // custom filter multiple value
    NgSelectModule, //angular dropdown
    DragDropDirective, //file upload directive
    FileSizePipeConvertPipe, //file size convert pipe/filter
    OnlyNumberDirective, // take only number
    AutofocusDirective,
    RoundPipe,
    SafeUrlPipe,
    NgInitDirective,
    SafeHtmlPipe,
    NgxTinymceModule,
    MustMatchDirective, //match password or confirm password or email or confirm passwor
    SlickCarouselModule, //angular slick slider
    AutocompleteModule, //autocomplite module
  ]
})
export class SharedModule { }
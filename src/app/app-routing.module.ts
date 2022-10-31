import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { 
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'verification-email/:id',
    loadChildren: () => import('./pages/auth/verification-email/verification-email.module').then( m => m.VerificationEmailPageModule)
  },
  { 
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'product',
    loadChildren: () => import('./pages/product/product.module').then( m => m.ProductPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'product-details/:id',
    loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'exam-group/:action/:id',
    loadChildren: () => import('./pages/exam-group/exam-group.module').then( m => m.ExamGroupPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'report-list/:id',
    loadChildren: () => import('./pages/report-list/report-list.module').then( m => m.ReportListPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'exam-window/:id',
    loadChildren: () => import('./pages/exam-window/exam-window.module').then( m => m.ExamWindowPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'exam-report/:examid/:centerid/:examdate/:purpose',
    loadChildren: () => import('./pages/exam-report/exam-report.module').then( m => m.ExamReportPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'overall-report/:examid/:centerid',
    loadChildren: () => import('./pages/overall-report/overall-report.module').then( m => m.OverallReportPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'profile-details',
    loadChildren: () => import('./pages/profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'profile-edit/:id',
    loadChildren: () => import('./pages/profile-edit/profile-edit.module').then( m => m.ProfileEditPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'user-details/:id',
    loadChildren: () => import('./pages/user-details/user-details.module').then( m => m.UserDetailsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'order-status/:id',
    loadChildren: () => import('./pages/order-status/order-status.module').then( m => m.OrderStatusPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./pages/contact-us/contact-us.module').then( m => m.ContactUsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'register-success',
    loadChildren: () => import('./pages/auth/register-success/register-success.module').then( m => m.RegisterSuccessPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'cms/:action',
    loadChildren: () => import('./pages/cms/cms.module').then( m => m.CmsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '**',   // redirects all other routes to the main page
    redirectTo: 'home'
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

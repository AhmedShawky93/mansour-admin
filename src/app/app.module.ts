import { AuthService } from '@app/shared/auth.service';
import { AppRoutingModule } from './routing/app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, CanActivate } from '@angular/router';

// pagination
import { NgxPaginationModule } from 'ngx-pagination';
//chart js
import { ChartsModule } from 'ng2-charts';
// material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule, MatDatepickerModule, MatInputModule, MatButtonModule,
  MatCheckboxModule, MatFormFieldModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

// date range
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

// rating 
import { BarRatingModule } from 'ngx-bar-rating';
// maxlength text 
import { TruncateModule } from 'ng2-truncate';



import { AppComponent } from './app.component';
import { LeftSidebarComponent } from './layout/left-sidebar/left-sidebar.component';
import { TopBarComponent } from './layout/top-bar/top-bar.component';
import { LoginComponent } from './pages/login/login.component';
import { DetailsViewComponent } from './pages/order-mangament/details-view/details-view.component';
import { DoneComponent } from './pages/mangament-users/done/done.component';
import { ManageCastomerComponent } from './pages/mangament-users/manage-castomer/manage-castomer.component';
import { TotalOrdersComponent } from './pages/mangament-users/total-orders/total-orders.component';
import { OrderDetailsComponent } from './pages/order-mangament/order-details/order-details.component';
import { ForgetPasswordComponent } from './pages/login/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/login/reset-password/reset-password.component';
import { AddStoreComponent } from './pages/order-mangament/add-store/add-store.component';
import { PagesComponent } from './pages/pages.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AuthHttpInterceptor } from './shared/auth-http.interceptor';
import { AuthGuard } from './shared/auth.guard';
import { CategoryService } from './pages/services/category.service';
import { StringFilterPipe } from './shared/string-filter.pipe';
import { CategoryPipe } from './pages/order-mangament/inventory/categories/category.pipe';
import { GroupByDatePipe } from './shared/group-by-date.pipe';
import { NotificationFilterPipe } from './shared/notificaiton-filter.pipe';
import { NotificationsComponent } from './pages/order-mangament/marketing/notifications/notifications.component';
import { OffersComponent } from './pages/order-mangament/marketing/offers/offers.component';
import { AddOfferComponent } from './pages/order-mangament/marketing/offers/add-offer/add-offer.component';
import { EditOfferComponent } from './pages/order-mangament/marketing/offers/edit-offer/edit-category.component';
import { MedicalComponent } from './pages/order-mangament/medical/medical.component';
import { SettingComponent } from './pages/order-mangament/setting/setting.component';
import { OrdersComponent } from './pages/order-mangament/orders/orders.component';
import { CategoriesComponent } from './pages/order-mangament/inventory/categories/categories.component';
import { StaffComponent } from './pages/order-mangament/delivery/staff/staff.component';
import { AreasComponent } from './pages/order-mangament/delivery/areas/areas.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/order-mangament/inventory/products/products.component';
import { ReportingCenterComponent } from './pages/order-mangament/reporting-center/reporting-center.component';
import { ToastrModule } from 'ngx-toastr';
import { CustomerService } from '@app/pages/services/customer.service';
import { TotalComponent } from './pages/order-mangament/totalorders2/totalorders2.component';
import { DeliveryService } from '@app/pages/services/delivery.service';
import { AreasService } from '@app/pages/services/areas.service';
import { OrdersService } from '@app/pages/services/orders.service';
import { CustomFormsModule } from 'ng2-validation';
import { HttpClient } from 'selenium-webdriver/http';
import { LoaderComponent } from './loader/loader.component';
import { ProductsService } from '@app/pages/services/products.service';
import { MomentModule } from 'angular2-moment';
import { adsComponent } from '@app/pages/order-mangament/marketing/ads/ads.component';
import { RequiredIfDirective } from '@app/shared/required-if.directive';
import { PrintReceiptComponent } from './pages/order-mangament/print-receipt/print-receipt.component';
import { OrderFilterPipe } from "./pages/order-mangament/totalorders2/order.pipe";
import { SummaryPipe } from './shared/summary.pipe';

@NgModule({
  declarations: [
    AppComponent, LeftSidebarComponent, TopBarComponent, LoginComponent, DetailsViewComponent,
    ProductsComponent, DoneComponent, ManageCastomerComponent, TotalOrdersComponent, adsComponent,
    OrderDetailsComponent, ForgetPasswordComponent, ResetPasswordComponent, AddStoreComponent, PagesComponent,
    StringFilterPipe, NotificationFilterPipe, GroupByDatePipe, NotificationsComponent, OffersComponent, AddOfferComponent,
    EditOfferComponent, MedicalComponent, SettingComponent, OrdersComponent, CategoriesComponent, StaffComponent,
    AreasComponent, HomeComponent, ProductsComponent, ReportingCenterComponent, TotalComponent, LoaderComponent,
    RequiredIfDirective, PrintReceiptComponent,
    CategoryPipe, OrderFilterPipe, SummaryPipe,

  ],
  imports: [
    AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, LoadingBarHttpClientModule, BarRatingModule, 
    NgxPaginationModule, BrowserAnimationsModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatStepperModule, MatIconModule, NgSelectModule, ChartsModule, ToastrModule.forRoot(),
    SatDatepickerModule, SatNativeDateModule, TruncateModule, ReactiveFormsModule, BrowserModule, CustomFormsModule, MomentModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    },
    AuthService,
    AuthGuard,
    CategoryService,
    MatNativeDateModule,
    CustomerService,
    DeliveryService,
    AreasService,
    OrdersService,
    ProductsService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }

import { GroupsComponent } from './pages/order-mangament/inventory/groups/groups.component';
import { BracnhesStoreService } from './pages/services/stores.service';
import { AuthService } from "@app/shared/auth.service";
import { AppRoutingModule } from "./routing/app-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, CanActivate } from "@angular/router";
import { AffiliateService } from './pages/services/affiliate.service';
// pagination
import { NgxPaginationModule } from "ngx-pagination";
//chart js
import { ChartsModule } from "ng2-charts";
// material
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatNativeDateModule,
  MatDatepickerModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
} from "@angular/material";
import { MatStepperModule } from "@angular/material/stepper";
import { MatIconModule } from "@angular/material/icon";

// date range
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { NgSelectModule } from "@ng-select/ng-select";

// rating
import { BarRatingModule } from "ngx-bar-rating";
// maxlength text
import { TruncateModule } from "ng2-truncate";

import { AppComponent } from "./app.component";
import { LeftSidebarComponent } from "./layout/left-sidebar/left-sidebar.component";
import { TopBarComponent } from "./layout/top-bar/top-bar.component";
import { LoginComponent } from "./pages/login/login.component";
import { DetailsViewComponent } from "./pages/order-mangament/details-view/details-view.component";
import { DoneComponent } from "./pages/mangament-users/done/done.component";
import { ManageCastomerComponent } from "./pages/mangament-users/manage-castomer/manage-castomer.component";
import { TotalOrdersComponent } from "./pages/mangament-users/total-orders/total-orders.component";
import { AdminLogComponent } from "./pages/mangament-users/admin-log/admin-log.component";
import { OrderDetailsComponent } from "./pages/order-mangament/order-details/order-details.component";
import { ForgetPasswordComponent } from "./pages/login/forget-password/forget-password.component";
import { ResetPasswordComponent } from "./pages/login/reset-password/reset-password.component";
import { AddStoreComponent } from "./pages/order-mangament/add-store/add-store.component";
import { PagesComponent } from "./pages/pages.component";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AuthHttpInterceptor } from "./shared/auth-http.interceptor";
import { AuthGuard } from "./shared/auth.guard";
import { CategoryService } from "./pages/services/category.service";
import { StringFilterPipe } from "./shared/string-filter.pipe";
import { CategoryPipe } from "./pages/order-mangament/inventory/categories/category.pipe";
import { GroupByDatePipe } from "./shared/group-by-date.pipe";
import { NotificationFilterPipe } from "./shared/notificaiton-filter.pipe";
import { NotificationsComponent } from "./pages/order-mangament/marketing/notifications/notifications.component";
import { OffersComponent } from "./pages/order-mangament/marketing/offers/offers.component";
import { AddOfferComponent } from "./pages/order-mangament/marketing/offers/add-offer/add-offer.component";
import { EditOfferComponent } from "./pages/order-mangament/marketing/offers/edit-offer/edit-category.component";
import { MedicalComponent } from "./pages/order-mangament/medical/medical.component";
import { SettingComponent } from "./pages/order-mangament/setting/setting.component";
import { OrdersComponent } from "./pages/order-mangament/orders/orders.component";
import { CategoriesComponent } from "./pages/order-mangament/inventory/categories/categories.component";
import { StaffComponent } from "./pages/order-mangament/delivery/staff/staff.component";
import { HomeComponent } from "./pages/home/home.component";
import { ReportingCenterComponent } from "./pages/order-mangament/reporting-center/reporting-center.component";
import { ToastrModule } from "ngx-toastr";
import { CustomerService } from "@app/pages/services/customer.service";
import { TotalComponent } from "./pages/order-mangament/totalorders2/totalorders2.component";
import { DeliveryService } from "@app/pages/services/delivery.service";
import { AreasService } from "@app/pages/services/areas.service";
import { OrdersService } from "@app/pages/services/orders.service";
import { CustomFormsModule } from "ng2-validation";
import { HttpClient } from "selenium-webdriver/http";
import { LoaderComponent } from "./loader/loader.component";
import { ProductsService } from "@app/pages/services/products.service";
import { PagesService } from "@app/pages/services/pages.service";
import { MomentModule } from "angular2-moment";
import { adsComponent } from "@app/pages/order-mangament/marketing/ads/ads.component";
import { RequiredIfDirective } from "@app/shared/required-if.directive";
import { PrintReceiptComponent } from "./pages/order-mangament/print-receipt/print-receipt.component";
import { OrderFilterPipe } from "./pages/order-mangament/totalorders2/order.pipe";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { BrandsComponent } from "./pages/brands/brands.component";
import { ButtonSpinnerDirective } from "./shared/directives/button-spinner.directive";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { SharedModule } from "./shared/shared.module";
import { NgxPermissionsModule } from 'ngx-permissions';
import { DeliveredPipe } from "./pages/stars/pipes/delivered.pipe";
import { DeliveryFilterPipe } from "./shared/delivery-filter.pipe";
import { CustomAdsComponent } from "./pages/store-front/custom-ads/custom-ads.component";
import { ProductFilterPipe } from "./shared/product-filter.pipe";
import { ContactusComponent } from "./pages/contact-us/contact-us.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { GroupsPipe } from './pages/order-mangament/inventory/groups/groups.pipe';
import { OrdersDeliveryComponent } from './pages/order-mangament/orders-delivery/orders-delivery.component';
import { OrderDeliveryDetailsComponent } from './pages/order-mangament/orders-delivery/order-delivery-details/order-delivery-details.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AddEditOrderComponent } from './pages/order-mangament/orders/add-edit-order/add-edit-order.component';
import { AddEditCustomerComponent } from './pages/mangament-users/manage-castomer/add-edit-customer/add-edit-customer.component';
import { DynamicSettingsComponent } from '@app/pages/dynamic-settings/dynamic-settings.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { ImportsComponent } from './pages/imports/imports.component';
import { ProgressBarModule } from "angular-progress-bar"
import { MenuCreatorComponent } from './pages/menu-creator/menu-creator.component';
import { StaticPagesComponent } from './pages/static-pages/static-pages.component';
import { AddEditPageComponent } from './pages/static-pages/add-edit-page/add-edit-page.component';
import { SlugifyPipe } from './pages/static-pages/pipes/slugify.pipe';



@NgModule({
  declarations: [
    AppComponent,
    LeftSidebarComponent,
    TopBarComponent,
    LoginComponent,
    DetailsViewComponent,
    DoneComponent,
    ManageCastomerComponent,
    TotalOrdersComponent,
    AdminLogComponent,
    CustomAdsComponent,
    ContactusComponent,
    adsComponent,
    OrderDetailsComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AddStoreComponent,
    PagesComponent,
    ProductFilterPipe,
    DeliveryFilterPipe,
    NotificationFilterPipe,
    GroupByDatePipe,
    SlugifyPipe,
    NotificationsComponent,
    OffersComponent,
    AddOfferComponent,
    EditOfferComponent,
    MedicalComponent,
    SettingComponent,
    OrdersComponent,
    CategoriesComponent,
    StaffComponent,
    HomeComponent,
    ReportingCenterComponent,
    TotalComponent,
    LoaderComponent,
    RequiredIfDirective,
    PrintReceiptComponent,
    CategoryPipe,
    GroupsPipe,
    OrderFilterPipe,
    BrandsComponent,
    ReportsComponent,
    GroupsComponent,
    OrdersDeliveryComponent,
    OrderDeliveryDetailsComponent,
    AddEditOrderComponent,
    AddEditCustomerComponent,
    ImportsComponent,
    DynamicSettingsComponent,
    MenuCreatorComponent,
    StaticPagesComponent,
    AddEditPageComponent
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    BarRatingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    NgSelectModule,
    ChartsModule,
    ToastrModule.forRoot(),
    SatDatepickerModule,
    SatNativeDateModule,
    TruncateModule,
    ReactiveFormsModule,
    BrowserModule,
    CustomFormsModule,
    MomentModule,
    NgxMaterialTimepickerModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    SharedModule,
    NgxPermissionsModule.forRoot(),
    AngularEditorModule,
    ColorPickerModule,
    ProgressBarModule
  ],
  exports: [
    DynamicSettingsComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    AuthService,
    AuthGuard,
    CategoryService,
    MatNativeDateModule,
    BracnhesStoreService,
    CustomerService,
    DeliveryService,
    AreasService,
    OrdersService,
    ProductsService,
    AffiliateService,
    PagesService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

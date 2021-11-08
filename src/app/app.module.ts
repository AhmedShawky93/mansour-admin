import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from "@angular/common/http";
import { NgModule } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioGroup,
  MatRadioModule,
  MatSelectModule,
} from "@angular/material";
import { MatIconModule } from "@angular/material/icon";
import { MatStepperModule } from "@angular/material/stepper";
import { BrowserModule } from "@angular/platform-browser";
// material
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  FroalaEditorModule,
  FroalaViewModule,
} from "angular-froala-wysiwyg";
import { ProgressBarModule } from "angular-progress-bar";
import { MomentModule } from "angular2-moment";
//chart js
// import { ChartsModule } from "ng2-charts";
// maxlength text
import { TruncateModule } from "ng2-truncate";
import { CustomFormsModule } from "ng2-validation";
import { FileManagerModule } from "ng6-file-man";
// rating
import { BarRatingModule } from "ngx-bar-rating";
import { ColorPickerModule } from "ngx-color-picker";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
// pagination
import { NgxPaginationModule } from "ngx-pagination";
import { NgxPermissionsModule } from "ngx-permissions";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
// date range
import {
  SatDatepickerModule,
  SatNativeDateModule,
} from "saturn-datepicker";

import {
  DynamicSettingsComponent,
} from "@app/pages/dynamic-settings/dynamic-settings.component";
import {
  adsComponent,
} from "@app/pages/order-mangament/marketing/ads/ads.component";
import { AreasService } from "@app/pages/services/areas.service";
import { CustomerService } from "@app/pages/services/customer.service";
import { DeliveryService } from "@app/pages/services/delivery.service";
import { OrdersService } from "@app/pages/services/orders.service";
import { PagesService } from "@app/pages/services/pages.service";
import { ProductsService } from "@app/pages/services/products.service";
import { AuthService } from "@app/shared/auth.service";
import { RequiredIfDirective } from "@app/shared/required-if.directive";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgSelectModule } from "@ng-select/ng-select";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";

import { AppComponent } from "./app.component";
import {
  LeftSidebarComponent,
} from "./layout/left-sidebar/left-sidebar.component";
import { TopBarComponent } from "./layout/top-bar/top-bar.component";
import { LoaderComponent } from "./loader/loader.component";
import { BrandsComponent } from "./pages/brands/brands.component";
import { ContactusComponent } from "./pages/contact-us/contact-us.component";
import { HomeComponent } from "./pages/home/home.component";
import { ImportsComponent } from "./pages/imports/imports.component";
import {
  ForgetPasswordComponent,
} from "./pages/login/forget-password/forget-password.component";
import { LoginComponent } from "./pages/login/login.component";
import {
  ResetPasswordComponent,
} from "./pages/login/reset-password/reset-password.component";
import {
  AdminLogComponent,
} from "./pages/mangament-users/admin-log/admin-log.component";
import { DoneComponent } from "./pages/mangament-users/done/done.component";
import {
  AddEditCustomerComponent,
} from "./pages/mangament-users/manage-castomer/add-edit-customer/add-edit-customer.component";
import {
  ManageCastomerComponent,
} from "./pages/mangament-users/manage-castomer/manage-castomer.component";
import {
  TotalOrdersComponent,
} from "./pages/mangament-users/total-orders/total-orders.component";
import {
  MenuCreatorComponent,
} from "./pages/menu-creator/menu-creator.component";
import {
  AddStoreComponent,
} from "./pages/order-mangament/add-store/add-store.component";
import {
  StaffComponent,
} from "./pages/order-mangament/delivery/staff/staff.component";
import {
  DetailsViewComponent,
} from "./pages/order-mangament/details-view/details-view.component";
import {
  FilemanagerComponent,
} from "./pages/order-mangament/filemanager/filemanager.component";
import {
  CategoriesComponent,
} from "./pages/order-mangament/inventory/categories/categories.component";
import {
  CategoryPipe,
} from "./pages/order-mangament/inventory/categories/category.pipe";
import {
  GroupsComponent,
} from "./pages/order-mangament/inventory/groups/groups.component";
import {
  GroupsPipe,
} from "./pages/order-mangament/inventory/groups/groups.pipe";
import {
  NotificationsComponent,
} from "./pages/order-mangament/marketing/notifications/notifications.component";
import {
  AddOfferComponent,
} from "./pages/order-mangament/marketing/offers/add-offer/add-offer.component";
import {
  EditOfferComponent,
} from "./pages/order-mangament/marketing/offers/edit-offer/edit-category.component";
import {
  OffersComponent,
} from "./pages/order-mangament/marketing/offers/offers.component";
import {
  MedicalComponent,
} from "./pages/order-mangament/medical/medical.component";
import {
  OrderDetailsComponent,
} from "./pages/order-mangament/order-details/order-details.component";
import {
  OrderDeliveryDetailsComponent,
} from "./pages/order-mangament/orders-delivery/order-delivery-details/order-delivery-details.component";
import {
  OrdersDeliveryComponent,
} from "./pages/order-mangament/orders-delivery/orders-delivery.component";
import {
  AddEditOrderComponent,
} from "./pages/order-mangament/orders/add-edit-order/add-edit-order.component";
import {
  OrdersComponent,
} from "./pages/order-mangament/orders/orders.component";
import {
  PrintReceiptComponent,
} from "./pages/order-mangament/print-receipt/print-receipt.component";
import {
  ReportingCenterComponent,
} from "./pages/order-mangament/reporting-center/reporting-center.component";
import {
  SettingComponent,
} from "./pages/order-mangament/setting/setting.component";
import {
  OrderFilterPipe,
} from "./pages/order-mangament/totalorders2/order.pipe";
import {
  TotalComponent,
} from "./pages/order-mangament/totalorders2/totalorders2.component";
import { PagesComponent } from "./pages/pages.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { AffiliateService } from "./pages/services/affiliate.service";
import { CategoryService } from "./pages/services/category.service";
import { BracnhesStoreService } from "./pages/services/stores.service";
import {
  AddEditPageComponent,
} from "./pages/static-pages/add-edit-page/add-edit-page.component";
import { SlugifyPipe } from "./pages/static-pages/pipes/slugify.pipe";
import {
  StaticPagesComponent,
} from "./pages/static-pages/static-pages.component";
import {
  CustomAdsComponent,
} from "./pages/store-front/custom-ads/custom-ads.component";
import { AppRoutingModule } from "./routing/app-routing.module";
import { AuthHttpInterceptor } from "./shared/auth-http.interceptor";
import { AuthGuard } from "./shared/auth.guard";
import { DeliveryFilterPipe } from "./shared/delivery-filter.pipe";
import { GroupByDatePipe } from "./shared/group-by-date.pipe";
import { NotificationFilterPipe } from "./shared/notificaiton-filter.pipe";
import { ProductFilterPipe } from "./shared/product-filter.pipe";
import { SharedModule } from "./shared/shared.module";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

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
    FilemanagerComponent,
    ReportingCenterComponent,
    TotalComponent,
    LoaderComponent,
    RequiredIfDirective,
    PrintReceiptComponent,
    CategoryPipe,
    GroupsPipe,
    SlugifyPipe,
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
    FileManagerModule,
    LoadingBarHttpClientModule,
    BarRatingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    NgxSpinnerModule,
    MatStepperModule,
    MatIconModule,
    MatRadioModule,
    NgSelectModule,
    MatSelectModule,
    // ChartsModule,
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
    ProgressBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  exports: [
    DynamicSettingsComponent,
    MatRadioModule,
    MatSelectModule,
    MatRadioGroup
  ],
  providers: [
    SlugifyPipe,
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

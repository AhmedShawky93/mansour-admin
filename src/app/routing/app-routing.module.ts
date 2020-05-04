import { PagesComponent } from "../pages/pages.component";
import { ResetPasswordComponent } from "../pages/login/reset-password/reset-password.component";
import { DoneComponent } from "../pages/mangament-users/done/done.component";
import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "../pages/login/login.component";
import { ManageCastomerComponent } from "../pages/mangament-users/manage-castomer/manage-castomer.component";
import { TotalOrdersComponent } from "../pages/mangament-users/total-orders/total-orders.component";
import { OrderDetailsComponent } from "../pages/order-mangament/order-details/order-details.component";
import { ForgetPasswordComponent } from "../pages/login/forget-password/forget-password.component";
import { AddStoreComponent } from "../pages/order-mangament/add-store/add-store.component";
import { AuthGuard } from "../shared/auth.guard";
import { OffersComponent } from "../pages/order-mangament/marketing/offers/offers.component";
import { AddOfferComponent } from "../pages/order-mangament/marketing/offers/add-offer/add-offer.component";
import { EditOfferComponent } from "../pages/order-mangament/marketing/offers/edit-offer/edit-category.component";
import { NotificationsComponent } from "../pages/order-mangament/marketing/notifications/notifications.component";
import { adsComponent } from "@app/pages/order-mangament/marketing/ads/ads.component";
import { MedicalComponent } from "../pages/order-mangament/medical/medical.component";
import { SettingComponent } from "../pages/order-mangament/setting/setting.component";
import { OrdersComponent } from "../pages/order-mangament/orders/orders.component";
import { CategoriesComponent } from "../pages/order-mangament/inventory/categories/categories.component";
import { StaffComponent } from "../pages/order-mangament/delivery/staff/staff.component";
import { HomeComponent } from "../pages/home/home.component";
import { ReportingCenterComponent } from "../pages/order-mangament/reporting-center/reporting-center.component";
import { TotalComponent } from "../pages/order-mangament/totalorders2/totalorders2.component";
import { PrintReceiptComponent } from "@app/pages/order-mangament/print-receipt/print-receipt.component";
import { BrandsComponent } from "@app/pages/brands/brands.component";
import { NgxPermissionsGuard } from "ngx-permissions";

const routes: Routes = [
  { path: "login", component: LoginComponent, data: { title: "Login" } },
  {
    path: "add-store",
    component: AddStoreComponent,
    data: { title: "Add store" },
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent,
    data: { title: "Reset password" },
  },
  {
    path: "forget-password",
    component: ForgetPasswordComponent,
    data: { title: "Forget password" },
  },
  { path: "", redirectTo: "/pages/home", pathMatch: "full" },

  {
    path: "pages",
    component: PagesComponent,
    children: [
      { path: "done", component: DoneComponent },
      // trolly
      { path: "home", component: HomeComponent, data: { title: "Home" } },
      {
        path: "manage-customer",
        component: ManageCastomerComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Customers", permissions: {only: ['ADMIN', 'View Customers'], redirectTo: '/pages/home'}},
      },
      {
        path: "promocodes",
        component: OffersComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Promo Codes", permissions: {only: ['ADMIN', 'View Promos'], redirectTo: '/pages/home'}},
      },
      {
        path: "promocodes/edit-offers/:id",
        component: EditOfferComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Edit Offers", permissions: {only: ['ADMIN', 'View Promos'], redirectTo: '/pages/home'} },
      },
      { path: "ads", component: adsComponent, data: { title: "Ads" } },
      {
        path: "promocodes/add-offers",
        component: AddOfferComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Add Offers", permissions: {only: ['ADMIN', 'View Promos'], redirectTo: '/pages/home'} },
      },
      {
        path: "promocodes/edit-offers",
        component: EditOfferComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Edit Offers", permissions: {only: ['ADMIN', 'View Promos'], redirectTo: '/pages/home'} },
      },
      {
        path: "notifications",
        component: NotificationsComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Notifications", permissions: {only: ['ADMIN', 'View Notifications'], redirectTo: '/pages/home'} },
      },
      // {
      //   path: "medical",
      //   component: MedicalComponent,
      //   canActivate: [NgxPermissionsGuard],
      //   data: { title: "Medical", permissions: {only: ['ADMIN', 'View Medical'], redirectTo: '/pages/home'} },
      // },
      {
        path: "settings",
        component: SettingComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Settings", permissions: {only: ['ADMIN', 'View Settings'], redirectTo: '/pages/home'} },
      },
      { path: "orders", component: OrdersComponent, data: { title: "Orders", permissions: {only: ['ADMIN', 'View Orders'], redirectTo: '/pages/home'} } },
      {
        path: "categories",
        component: CategoriesComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Categories", permissions: {only: ['ADMIN', 'View Categories'], redirectTo: '/pages/home'} },
      },

      { path: "staff", component: StaffComponent, canActivate: [NgxPermissionsGuard], data: { title: "Staff", permissions: {only: ['ADMIN', 'View Staff'], redirectTo: '/pages/home'} } },
      {
        path: "reporting-center",
        component: ReportingCenterComponent,
        data: { title: "Reporting Center" },
      },
      {
        path: "total-orders",
        component: TotalOrdersComponent,
        data: { title: "Total Orders" },
      },
      {
        path: "staff/total-orders2/:id",
        component: TotalComponent,
        data: { title: "Total Orders" },
      },
      {
        path: "orders/order-details/:id",
        component: OrderDetailsComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "Order Details", permissions: {only: ['ADMIN', 'View Orders'], redirectTo: '/pages/home'} },
      },
      {
        path: "print-receipt/:id",
        component: PrintReceiptComponent,
        canActivate: [NgxPermissionsGuard],
        data: { title: "print-receipt", permissions: {only: ['ADMIN', 'View Orders'], redirectTo: '/pages/home'} },
      },
      { path: "brands", component: BrandsComponent, canActivate: [NgxPermissionsGuard], data: { title: "Brands", permissions: {only: ['ADMIN', 'View Brands'], redirectTo: '/pages/home'} } },
      {
        path: "stars",
        loadChildren: "../pages/stars/stars.module#StarsModule",
        canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ADMIN', 'View Rewards', 'View Gift Requests'], redirectTo: '/pages/home'}}
      },
      // {
      //   path: "options",
      //   loadChildren:
      //     "../pages/order-mangament/inventory/options/options.module#OptionsModule",
      //   canActivate: [NgxPermissionsGuard],
      //   data: {permissions: {only: ['ADMIN', 'View Options'], redirectTo: '/pages/home'}}
      // },
      {
        path: "products",
        loadChildren:
          "../pages/order-mangament/inventory/products/products.module#ProductsModule",
        canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ADMIN', 'View Products'], redirectTo: '/pages/home'}}
      },
      {
        path: "sub-admins",
        loadChildren: "../pages/access-admins/sub-admin.module#SubAdminModule",
        canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ADMIN', 'View Admins'], redirectTo: '/pages/home'}}
      },
      {
        path: "cities",
        loadChildren:
          "../pages/order-mangament/delivery/cities/cities.module#CitiesModule",
        canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ADMIN', 'View Cities'], redirectTo: '/pages/home'}}
      },
      {
        path: "order-status",
        loadChildren:
          "../pages/order-mangament/order-states/order-states.module#OrderStatesModule",
        canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ADMIN', 'View Order States'], redirectTo: '/pages/home'}}
      },
      {
        path: "staff-delivery",
        loadChildren:
          "../pages/order-mangament/delivery/staff-delivery/staff-delivery.module#StaffDeliveryModule",
        canActivate: [NgxPermissionsGuard],
        data: {permissions: {only: ['ADMIN', 'View Staff'], redirectTo: '/pages/home'}}
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

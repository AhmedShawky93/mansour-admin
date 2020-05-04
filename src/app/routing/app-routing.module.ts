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
        data: { title: "Customers", permissions: ['ADMIN', 'View Customers']},
      },
      {
        path: "promocodes",
        component: OffersComponent,
        data: { title: "Promo Codes", permissions: ['ADMIN', 'View Promos']},
      },
      {
        path: "promocodes/edit-offers/:id",
        component: EditOfferComponent,
        data: { title: "Edit Offers", permissions: ['ADMIN', 'View Promos'] },
      },
      { path: "ads", component: adsComponent, data: { title: "Ads" } },
      {
        path: "promocodes/add-offers",
        component: AddOfferComponent,
        data: { title: "Add Offers", permissions: ['ADMIN', 'View Promos'] },
      },
      {
        path: "promocodes/edit-offers",
        component: EditOfferComponent,
        data: { title: "Edit Offers", permissions: ['ADMIN', 'View Promos'] },
      },
      {
        path: "notifications",
        component: NotificationsComponent,
        data: { title: "Notifications", permissions: ['ADMIN', 'View Notifications'] },
      },
      {
        path: "medical",
        component: MedicalComponent,
        data: { title: "Medical", permissions: ['ADMIN', 'View Medical'] },
      },
      {
        path: "settings",
        component: SettingComponent,
        data: { title: "Settings", permissions: ['ADMIN', 'View Settings'] },
      },
      { path: "orders", component: OrdersComponent, data: { title: "Orders", permissions: ['ADMIN', 'View Orders'] } },
      {
        path: "categories",
        component: CategoriesComponent,
        data: { title: "Categories", permissions: ['ADMIN', 'View Categories'] },
      },

      { path: "staff", component: StaffComponent, data: { title: "Staff", permissions: ['ADMIN', 'View Staff'] } },
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
        data: { title: "Order Details", permissions: ['ADMIN', 'View Orders'] },
      },
      {
        path: "print-receipt/:id",
        component: PrintReceiptComponent,
        data: { title: "print-receipt", permissions: ['ADMIN', 'View Orders'] },
      },
      { path: "brands", component: BrandsComponent, data: { title: "Brands", permissions: ['ADMIN', 'View Brands'] } },
      {
        path: "stars",
        loadChildren: "../pages/stars/stars.module#StarsModule",
        data: {permissions: ['ADMIN', 'View Rewards', 'View Gift Requests']}
      },
      {
        path: "options",
        loadChildren:
          "../pages/order-mangament/inventory/options/options.module#OptionsModule",
        data: {permissions: ['ADMIN', 'View Options']}
      },
      {
        path: "products",
        loadChildren:
          "../pages/order-mangament/inventory/products/products.module#ProductsModule",
        data: {permissions: ['ADMIN', 'View Products']}
      },
      {
        path: "sub-admins",
        loadChildren: "../pages/access-admins/sub-admin.module#SubAdminModule",
        data: {permissions: ['ADMIN', 'View Admins']}
      },
      {
        path: "cities",
        loadChildren:
          "../pages/order-mangament/delivery/cities/cities.module#CitiesModule",
        data: {permissions: ['ADMIN', 'View Cities']}
      },
      {
        path: "order-status",
        loadChildren:
          "../pages/order-mangament/order-states/order-states.module#OrderStatesModule",
        data: {permissions: ['ADMIN', 'View Order States']}
      },
      {
        path: "staff-delivery",
        loadChildren:
          "../pages/order-mangament/delivery/staff-delivery/staff-delivery.module#StaffDeliveryModule",
        data: {permissions: ['ADMIN', 'View Staff']}
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

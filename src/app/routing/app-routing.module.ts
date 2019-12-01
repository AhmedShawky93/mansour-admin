
import { PagesComponent } from '../pages/pages.component';
import { ResetPasswordComponent } from '../pages/login/reset-password/reset-password.component';
import { DoneComponent } from '../pages/mangament-users/done/done.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { ManageCastomerComponent } from '../pages/mangament-users/manage-castomer/manage-castomer.component';
import { TotalOrdersComponent } from '../pages/mangament-users/total-orders/total-orders.component';
import { OrderDetailsComponent } from '../pages/order-mangament/order-details/order-details.component';
import { ForgetPasswordComponent } from '../pages/login/forget-password/forget-password.component';
import { AddStoreComponent } from '../pages/order-mangament/add-store/add-store.component';
import { AuthGuard } from '../shared/auth.guard';
import { OffersComponent } from '../pages/order-mangament/marketing/offers/offers.component';
import { AddOfferComponent } from '../pages/order-mangament/marketing/offers/add-offer/add-offer.component';
import { EditOfferComponent } from '../pages/order-mangament/marketing/offers/edit-offer/edit-category.component';
import { NotificationsComponent } from '../pages/order-mangament/marketing/notifications/notifications.component';
import { adsComponent } from '@app/pages/order-mangament/marketing/ads/ads.component';
import { MedicalComponent } from '../pages/order-mangament/medical/medical.component';
import { SettingComponent } from '../pages/order-mangament/setting/setting.component';
import { OrdersComponent } from '../pages/order-mangament/orders/orders.component';
import { CategoriesComponent } from '../pages/order-mangament/inventory/categories/categories.component';
import { StaffComponent } from '../pages/order-mangament/delivery/staff/staff.component';
import { AreasComponent } from '../pages/order-mangament/delivery/areas/areas.component';
import { HomeComponent } from '../pages/home/home.component';
import { ProductsComponent } from '../pages/order-mangament/inventory/products/products.component';
import { ReportingCenterComponent } from '../pages/order-mangament/reporting-center/reporting-center.component';
import { TotalComponent } from '../pages/order-mangament/totalorders2/totalorders2.component';
import { PrintReceiptComponent } from '@app/pages/order-mangament/print-receipt/print-receipt.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'add-store', component: AddStoreComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: '', redirectTo: '/pages/home', pathMatch: 'full' },

  {
    path: 'pages', component: PagesComponent, children: [
      { path: 'done', component: DoneComponent },
      // trolly
      { path: 'home', component: HomeComponent, data: { title: 'Home' } },
      { path: 'manage-customer', component: ManageCastomerComponent, data: { title: 'Customers' } },
      { path: 'promocodes', component: OffersComponent, data: { title: 'Promo Codes' } },
      { path: 'promocodes/edit-offers/:id', component: EditOfferComponent, data: { title: 'Edit Offers' } },
      { path: 'ads', component: adsComponent, data: { title: 'Ads' } },
      { path: 'promocodes/add-offers', component: AddOfferComponent, data: { title: 'Add Offers' } },
      { path: 'promocodes/edit-offers', component: EditOfferComponent, data: { title: 'Edit Offers' } },
      { path: 'notifications', component: NotificationsComponent, data: { title: 'Notifications' } },
      { path: 'medical', component: MedicalComponent, data: { title: 'Medical' } },
      { path: 'settings', component: SettingComponent, data: { title: 'Settings' } },
      { path: 'orders', component: OrdersComponent, data: { title: 'Orders' } },
      { path: 'categories', component: CategoriesComponent, data: { title: 'Categories' } },
      { path: 'products', component: ProductsComponent, data: { title: 'Products' } },
      { path: 'staff', component: StaffComponent, data: { title: 'Staff' } },
      { path: 'areas', component: AreasComponent, data: { title: 'Areas' } },
      { path: 'reporting-center', component: ReportingCenterComponent, data: { title: 'Reporting Center' } },
      { path: 'total-orders', component: TotalOrdersComponent, data: { title: 'Total Orders' } },
      { path: 'staff/total-orders2/:id', component: TotalComponent, data: { title: 'Total Orders' } },
      { path: 'orders/order-details/:id', component: OrderDetailsComponent, data: { title: 'Order Details' } },
      { path: 'print-receipt/:id', component: PrintReceiptComponent, data: { title: 'print-receipt' } },

    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

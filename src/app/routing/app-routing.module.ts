import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgxPermissionsGuard } from "ngx-permissions";

import { BrandsComponent } from "@app/pages/brands/brands.component";
import { ImportsComponent } from "@app/pages/imports/imports.component";
import { AdminLogComponent } from "@app/pages/mangament-users/admin-log/admin-log.component";
import { MenuCreatorComponent } from "@app/pages/menu-creator/menu-creator.component";
import { FilemanagerComponent } from "@app/pages/order-mangament/filemanager/filemanager.component";
import { adsComponent } from "@app/pages/order-mangament/marketing/ads/ads.component";
import { OrderDeliveryDetailsComponent } from "@app/pages/order-mangament/orders-delivery/order-delivery-details/order-delivery-details.component";
import { OrdersDeliveryComponent } from "@app/pages/order-mangament/orders-delivery/orders-delivery.component";
import { PrintReceiptComponent } from "@app/pages/order-mangament/print-receipt/print-receipt.component";
import { ReportsComponent } from "@app/pages/reports/reports.component";
import { StaticPagesComponent } from "@app/pages/static-pages/static-pages.component";
import { CustomAdsComponent } from "@app/pages/store-front/custom-ads/custom-ads.component";

import { ContactusComponent } from "../pages/contact-us/contact-us.component";
import { HomeComponent } from "../pages/home/home.component";
import { ForgetPasswordComponent } from "../pages/login/forget-password/forget-password.component";
import { LoginComponent } from "../pages/login/login.component";
import { ResetPasswordComponent } from "../pages/login/reset-password/reset-password.component";
import { DoneComponent } from "../pages/mangament-users/done/done.component";
import { ManageCastomerComponent } from "../pages/mangament-users/manage-castomer/manage-castomer.component";
import { TotalOrdersComponent } from "../pages/mangament-users/total-orders/total-orders.component";
import { AddStoreComponent } from "../pages/order-mangament/add-store/add-store.component";
import { StaffComponent } from "../pages/order-mangament/delivery/staff/staff.component";
import { CategoriesComponent } from "../pages/order-mangament/inventory/categories/categories.component";
import { GroupsComponent } from "../pages/order-mangament/inventory/groups/groups.component";
import { NotificationsComponent } from "../pages/order-mangament/marketing/notifications/notifications.component";
import { AddOfferComponent } from "../pages/order-mangament/marketing/offers/add-offer/add-offer.component";
import { EditOfferComponent } from "../pages/order-mangament/marketing/offers/edit-offer/edit-category.component";
import { OffersComponent } from "../pages/order-mangament/marketing/offers/offers.component";
import { OrderDetailsComponent } from "../pages/order-mangament/order-details/order-details.component";
import { OrdersComponent } from "../pages/order-mangament/orders/orders.component";
import { ReportingCenterComponent } from "../pages/order-mangament/reporting-center/reporting-center.component";
import { SettingComponent } from "../pages/order-mangament/setting/setting.component";
import { TotalComponent } from "../pages/order-mangament/totalorders2/totalorders2.component";
import { PagesComponent } from "../pages/pages.component";
import { AuthGuard } from "../shared/auth.guard";

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
    canActivate: [AuthGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      { path: "done", component: DoneComponent },
      // trolly
      { path: "home", component: HomeComponent, data: { title: "Home" } },
      {
        path: "manage-customer",
        component: ManageCastomerComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Customers",
          permissions: {
            only: ["ADMIN", "View Customers"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "menu-creator",
        component: MenuCreatorComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Menu",
          permissions: {
            only: ["ADMIN", "View Customers"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "static-pages",
        component: StaticPagesComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "static",
          permissions: {
            only: ["ADMIN", "View Customers"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "admin-log",
        component: AdminLogComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Admin log",
          permissions: {
            only: ["ADMIN", "View Customers"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "promocodes",
        component: OffersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Promo Codes",
          permissions: {
            only: ["ADMIN", "View Promos"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "promocodes/edit-offers/:id",
        component: EditOfferComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Edit Offers",
          permissions: {
            only: ["ADMIN", "View Promos"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "ads",
        component: adsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Slider",
          permissions: {
            only: ["ADMIN", "View Ads"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "stores",
        loadChildren: () =>
          import("../pages/order-mangament/stores/stores.module").then(
            (m) => m.StoresModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Stores"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "promocodes/add-offers",
        component: AddOfferComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Add Offers",
          permissions: {
            only: ["ADMIN", "View Promos"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "promocodes/edit-offers",
        component: EditOfferComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Edit Offers",
          permissions: {
            only: ["ADMIN", "View Promos"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "notifications",
        component: NotificationsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Notifications",
          permissions: {
            only: ["ADMIN", "View Notifications"],
            redirectTo: "/pages/home",
          },
        },
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
        data: {
          title: "Settings",
          permissions: {
            only: ["ADMIN", "View Settings"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "filemanager",
        component: FilemanagerComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "File Manager",
          permissions: {
            only: ["ADMIN", "View Settings"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "orders",
        component: OrdersComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Orders",
          permissions: {
            only: ["ADMIN", "View Orders"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "orders-delivery",
        component: OrdersDeliveryComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Orders Delivery",
          permissions: {
            only: ["ADMIN", "View Orders"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "orders-delivery/details/:id",
        component: OrderDeliveryDetailsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Details",
          permissions: {
            only: ["ADMIN", "View Details"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "categories",
        component: CategoriesComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Categories",
          permissions: {
            only: ["ADMIN", "View Categories"],
            redirectTo: "/pages/home",
          },
        },
      },

      {
        path: "staff",
        component: StaffComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Staff",
          permissions: {
            only: ["ADMIN", "View Staff"],
            redirectTo: "/pages/home",
          },
        },
      },
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
        data: {
          title: "Order Details",
          permissions: {
            only: ["ADMIN", "View Orders"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "print-receipt/:id",
        component: PrintReceiptComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "print-receipt",
          permissions: {
            only: ["ADMIN", "View Orders"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "brands",
        component: BrandsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Brands",
          permissions: {
            only: ["ADMIN", "View Brands"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "stars",
        loadChildren: () =>
          import("../pages/stars/stars.module").then((m) => m.StarsModule),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Rewards", "View Gift Requests"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "custom-ads",
        component: CustomAdsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Custom Ads",
          permissions: {
            only: ["ADMIN", "View Ads"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "contact-us",
        component: ContactusComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Contact Us",
          permissions: {
            only: ["ADMIN", "View Contacts"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "imports",
        component: ImportsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Imports",
          permissions: {
            only: ["ADMIN", "View Imports"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "prescription",
        canActivate: [NgxPermissionsGuard],
        loadChildren: () =>
          import("../pages/e-prescription/e-prescription.module").then(
            (m) => m.EPrescriptionModule
          ),
        data: {
          title: "E-PrescriptionModule",
          permissions: {
            only: ["ADMIN", "View Orders"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "options",
        loadChildren: () =>
          import(
            "../pages/order-mangament/inventory/options/options.module"
          ).then((m) => m.OptionsModule),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Options"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "products",
        loadChildren: () =>
          import(
            "../pages/order-mangament/inventory/products/products.module"
          ).then((m) => m.ProductsModule),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Products"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "sub-admins",
        loadChildren: () =>
          import("../pages/access-admins/sub-admin.module").then(
            (m) => m.SubAdminModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Admins"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "groups",
        component: GroupsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "groups",
          permissions: {
            only: ["ADMIN", "View Groups"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "cities",
        loadChildren: () =>
          import("../pages/order-mangament/delivery/cities/cities.module").then(
            (m) => m.CitiesModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Cities"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "order-status",
        loadChildren: () =>
          import(
            "../pages/order-mangament/order-states/order-states.module"
          ).then((m) => m.OrderStatesModule),
        // canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Order States"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "branches",
        loadChildren: () =>
          import(
            "../pages/order-mangament/delivery/staff-delivery/staff-delivery.module"
          ).then((m) => m.StaffDeliveryModule),
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ["ADMIN", "View Staff"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "affiliate",
        loadChildren: () =>
          import("../pages/mangament-users/affiliate/affiliate.module").then(
            (m) => m.AffiliateModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: ["ADMIN"], redirectTo: "/pages/home" } },
      },
      {
        path: "lists",
        loadChildren: () =>
          import("../pages/order-mangament/inventory/lists/lists.module").then(
            (m) => m.ListsModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Custom Lists",
          permissions: {
            only: ["ADMIN", "View Lists"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "sections",
        loadChildren: () =>
          import("../pages/store-front/sections/sections.module").then(
            (m) => m.SectionsModule
          ),
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Sections",
          permissions: {
            only: ["ADMIN", "View Sections"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "promotions",
        loadChildren: () =>
          import(
            "../pages/order-mangament/marketing/promotions/promotions.module"
          ).then((m) => m.PromotionsModule),
        canActivate: [NgxPermissionsGuard],
        data: {
          title: "Promotions",
          permissions: {
            only: ["ADMIN", "View Promos"],
            redirectTo: "/pages/home",
          },
        },
      },
      {
        path: "reports",
        component: ReportsComponent,
        data: { title: "Reports" },
      },
      {
        path: "transactions",
        canActivate: [NgxPermissionsGuard],
        loadChildren: () =>
          import(
            "../pages/order-mangament/transactions/transactions.module"
          ).then((m) => m.TransactionsModule),
        data: {
          title: "Transactions",
          permissions: {
            only: ["ADMIN", "View Orders"],
            redirectTo: "/pages/home",
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

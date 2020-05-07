import { AddEditStaffDeliveryComponent } from './add-edit-staff-delivery/add-edit-staff-delivery.component';
import { ViewStaffDeliveryComponent } from './view-staff-delivery/view-staff-delivery.component';
import { StaffDeliveryComponent } from './staff-delivery.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";

const router = [
  { path: "", component: StaffDeliveryComponent, data: { title: "branches" } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  declarations: [
    StaffDeliveryComponent,
    ViewStaffDeliveryComponent,
    AddEditStaffDeliveryComponent
  ],
})
export class StaffDeliveryModule {}

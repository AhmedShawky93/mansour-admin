import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderStatesComponent } from "./order-states.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { RouterModule } from "@angular/router";
import { ViewOrderStatesComponent } from "./view-order-states/view-order-states.component";
import { AddEditOrderStatesComponent } from "./add-edit-order-states/add-edit-order-states.component";
import { SharedModule } from "@app/shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";

const router = [
  {
    path: "",
    component: OrderStatesComponent,
    data: { title: "Order States" },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    NgxSpinnerModule,
  ],
  declarations: [
    OrderStatesComponent,
    ViewOrderStatesComponent,
    AddEditOrderStatesComponent,
  ],
})
export class OrderStatesModule {}

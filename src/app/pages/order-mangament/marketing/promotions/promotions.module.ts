import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
} from "@angular/material";
import { RouterModule } from "@angular/router";

import { NgxPaginationModule } from "ngx-pagination";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";

import { SharedModule } from "@app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";

import { AddEditPromotionComponent } from "./add-edit-promotion/add-edit-promotion.component";
import { PromotionsComponent } from "./promotions.component";

const router = [
  { path: "", component: PromotionsComponent, data: { title: "Promotions" } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    SharedModule,
  ],
  declarations: [PromotionsComponent, AddEditPromotionComponent],
})
export class PromotionsModule {}

import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PromotionsComponent } from "./promotions.component";
import { AddEditPromotionComponent } from "./add-edit-promotion/add-edit-promotion.component";
import { RouterModule } from "@angular/router";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import {
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
} from "@angular/material";
import { SharedModule } from "@app/shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";

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
    NgxSpinnerModule,
  ],
  declarations: [PromotionsComponent, AddEditPromotionComponent],
})
export class PromotionsModule {}

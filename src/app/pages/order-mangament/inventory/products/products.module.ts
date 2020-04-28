import { SharedModule } from "./../../../../shared/shared.module";
import { AddEditProductComponent } from "./add-edit-product/add-edit-product.component";
import { ProductsComponent } from "./products.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { ViewProductComponent } from "./view-product/view-product.component";

const router = [
  { path: "", component: ProductsComponent, data: { title: "Products" } },
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
  ],
  declarations: [
    ProductsComponent,
    ViewProductComponent,
    AddEditProductComponent,
  ],
})
export class ProductsModule {}

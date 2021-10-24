import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListsComponent } from "./lists.component";
import { AddEditListComponent } from "./add-edit-list/add-edit-list.component";
import { ViewListComponent } from "./view-list/view-list.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../../../shared/shared.module";

const router = [
  { path: "", component: ListsComponent, data: { title: "Custom Lists" } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    SharedModule,
  ],
  declarations: [ListsComponent, AddEditListComponent, ViewListComponent],
})
export class ListsModule {}

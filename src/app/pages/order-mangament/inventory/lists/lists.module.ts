import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListsComponent } from "./lists.component";
import { AddEditListComponent } from "./add-edit-list/add-edit-list.component";
import { ViewListComponent } from "./view-list/view-list.component";
import { RouterModule } from "@angular/router";

const router = [
  { path: "", component: ListsComponent, data: { title: "options" } },
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
    ListsComponent,
    AddEditListComponent,
    ViewListComponent,
  ],
})
export class ListsModule {}

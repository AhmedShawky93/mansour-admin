import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SectionsComponent } from "./sections.component";
import { AddEditSectionComponent } from "./add-edit-section/add-edit-section.component";
import { ViewSectionComponent } from "./view-section/view-section.component";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";

const router = [
  { path: "", component: SectionsComponent, data: { title: "Sections" } },
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
    SectionsComponent,
    AddEditSectionComponent,
    ViewSectionComponent,
  ],
})
export class SectionsModule {}

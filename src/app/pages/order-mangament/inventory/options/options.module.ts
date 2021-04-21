import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OptionsComponent } from "./options.component";
import { AddEditoOptionsComponent } from "./add-edit-options/add-edit-options.component";
import { ViewOptionComponent } from "./view-option/view-option.component";
import { RouterModule } from "@angular/router";
import {SharedModule} from '@app/shared/shared.module';

const router = [
  { path: "", component: OptionsComponent, data: { title: "options" } },
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
    OptionsComponent,
    AddEditoOptionsComponent,
    ViewOptionComponent,
  ],
})
export class OptionsModule {}

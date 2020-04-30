import { SharedModule } from "./../../shared/shared.module";
import { RulesComponent } from "./rules/rules.component";
import { UserSubAdminComponent } from "./user-sub-admin/user-sub-admin.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { NgSelectModule } from "@ng-select/ng-select";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

const router = [
  {
    path: "admins-users",
    component: UserSubAdminComponent,
    data: { title: "Admins users" },
  },
  {
    path: "admins-rules",
    component: RulesComponent,
    data: { title: "Rules" },
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
  ],
  declarations: [UserSubAdminComponent, RulesComponent],
})
export class SubAdminModule {}

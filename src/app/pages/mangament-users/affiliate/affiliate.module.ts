import { SharedModule } from './../../../shared/shared.module';
import { AddEditUserComponent } from './users/add-edit-user/add-edit-user.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { AffiliateUsersComponent } from './users/affiliate-users.component';
import { RequestsJoinComponent } from './requests-join/requests-join.component';
import { UsersHistoryComponent } from './users-history/users-history.component';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatStepperModule } from '@angular/material';
import { SatDatepickerModule } from 'saturn-datepicker';
import { NewAdminCreditComponent } from './users-history/new-admin-credit/new-admin-credit.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AffiliateDetailsComponent } from './users/affiliate-details/affiliate-details.component';
import { WithdrawRequestsComponent } from './withdraw-requests/withdraw-requests.component';
import { ViewActionAffiliateComponent } from './withdraw-requests/view-action-affiliate/view-action-affiliate.component';
import { PopupDetailsComponent } from './users-history/popup-details/popup-details.component';

const router = [
  { path: "users", component: AffiliateUsersComponent, data: { title: "Affiliate users" } },
  { path: "affliate-details/:id", component: AffiliateDetailsComponent, data: { title: "Affiliate details" } },
  { path: "requests-join", component: RequestsJoinComponent, data: { title: "Affiliate requests join" } },
  { path: "users-history", component: UsersHistoryComponent, data: { title: "Affiliate users history" } },
  { path: "withdraw-requests", component: WithdrawRequestsComponent, data: { title: "Affiliate withdraw requests" } },
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    NgSelectModule,
    SatDatepickerModule,
    MatDialogModule,
    NgxSpinnerModule
  ],
  declarations: [
    AffiliateUsersComponent,
    AddEditUserComponent,
    ViewUserComponent,
    RequestsJoinComponent,
    UsersHistoryComponent,
    NewAdminCreditComponent,
    AffiliateDetailsComponent,
    WithdrawRequestsComponent,
    ViewActionAffiliateComponent,
    PopupDetailsComponent
  ],
  entryComponents: [
    NewAdminCreditComponent,ViewActionAffiliateComponent,PopupDetailsComponent
  ],
})
export class AffiliateModule { }

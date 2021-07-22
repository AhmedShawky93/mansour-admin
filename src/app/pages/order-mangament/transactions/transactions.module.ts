import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import {RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '@app/shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {TransactionsRoutes} from '@app/pages/order-mangament/transactions/transactions.routes';
import {NgxSpinnerModule} from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(TransactionsRoutes),
    NgxPaginationModule,
    SharedModule,
    FormsModule,
    LoadingBarModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  declarations: [ListComponent]
})
export class TransactionsModule { }

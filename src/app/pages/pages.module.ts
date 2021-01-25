import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StringFilterPipe } from "../shared/string-filter.pipe";
import { CustomerService } from "@app/pages/services/customer.service";
import { LoaderComponent } from "@app/loader/loader.component";
import { AddEditOrderComponent } from './order-mangament/orders/add-edit-order/add-edit-order.component';
import { AddEditAddressComponent } from './mangament-users/manage-castomer/add-edit-address/add-edit-address.component';
import { AddEditCustomerComponent } from './mangament-users/manage-castomer/add-edit-customer/add-edit-customer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [CustomerService],
})
export class PagesModule {}

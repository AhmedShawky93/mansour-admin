import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

import { CustomerService } from "@app/pages/services/customer.service";
import { MenuService } from "@app/pages/services/menu.service";

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [CustomerService, MenuService],
  declarations: [],
})
export class PagesModule {}

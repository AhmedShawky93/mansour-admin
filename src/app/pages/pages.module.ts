import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StringFilterPipe } from "../shared/string-filter.pipe";
import { CustomerService } from "@app/pages/services/customer.service";
import { LoaderComponent } from "@app/loader/loader.component";

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [CustomerService],
})
export class PagesModule {}

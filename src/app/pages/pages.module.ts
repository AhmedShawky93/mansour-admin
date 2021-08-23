import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StringFilterPipe } from "../shared/string-filter.pipe";
import { CustomerService } from "@app/pages/services/customer.service";
import { LoaderComponent } from "@app/loader/loader.component";
import { MenuCreatorComponent } from './menu-creator/menu-creator.component';
import { MenuService } from "@app/pages/services/menu.service";
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { AddEditPageComponent } from './static-pages/add-edit-page/add-edit-page.component';

@NgModule({
  imports: [CommonModule],
  providers: [CustomerService, MenuService],
  declarations: [StaticPagesComponent, AddEditPageComponent],
})
export class PagesModule {}

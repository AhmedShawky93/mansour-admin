import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewComponent } from "./components/view/view.component";
import { ListComponent } from "./components/list/list.component";
import { ContainerComponent } from "./components/container/container.component";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "@app/shared/shared.module";
import { EPrescription } from "@app/pages/e-prescription/e-prescription.routes";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoadingBarModule } from "@ngx-loading-bar/core";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EPrescription),
    NgxPaginationModule,
    SharedModule,
    FormsModule,
    LoadingBarModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  declarations: [ViewComponent, ListComponent, ContainerComponent],
})
export class EPrescriptionModule {}

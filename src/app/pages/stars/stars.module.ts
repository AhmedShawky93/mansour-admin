import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GiftsComponent } from "./gifts/gifts.component";
import { RewardsComponent } from "./rewards/rewards.component";
import { RouterModule } from "@angular/router";
import { NgxPaginationModule } from "ngx-pagination";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchPipe } from "./pipes/search.pipe";
import { DeliveredPipe } from "./pipes/delivered.pipe";
import { SearchRewardsPipe } from "./pipes/search-rewards.pipe";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";
import { ButtonSpinnerDirective } from "@app/shared/directives/button-spinner.directive";
import { SharedModule } from "@app/shared/shared.module";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgxSpinnerModule } from "ngx-spinner";

export const routes = [
  {
    path: "gifts",
    component: GiftsComponent,
    data: {
      title: "Gift Requests",
      permissions: {
        only: ["ADMIN", "View Products"],
        redirectTo: "/pages/home",
      },
    },
  },
  {
    path: "rewards",
    component: RewardsComponent,
    data: {
      title: "Rewards",
      permissions: {
        only: ["ADMIN", "View Products"],
        redirectTo: "/pages/home",
      },
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    SharedModule,
    NgxSpinnerModule,
  ],
  declarations: [
    GiftsComponent,
    RewardsComponent,
    SearchPipe,
    DeliveredPipe,
    SearchRewardsPipe,
  ],
})
export class StarsModule {}

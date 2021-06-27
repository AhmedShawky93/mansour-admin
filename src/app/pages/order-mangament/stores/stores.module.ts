import { AddEditStoreComponent } from './add-edit-store/add-edit-store.component';
import { ViewStoreComponent } from './view-store/view-store.component';
import { StoresComponent } from './stores.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
// import { AgmCoreModule } from '@agm/core';

const router = [
  { path: "", component: StoresComponent, data: { title: "Stores" } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyAGue_n2PIwzqxAaxY0yzd5XgrVcF5hheI',
    //   libraries: ['places']
    // }),
  ],
  declarations: [
    StoresComponent,
    ViewStoreComponent,
    AddEditStoreComponent
  ],
})
export class StoresModule { }

import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  APP_INITIALIZER,
  NgModule,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { RouterModule } from "@angular/router";

import { NgxPaginationModule } from "ngx-pagination";
import { map } from "rxjs/operators";

import {
  AgmCoreModule,
  LAZY_MAPS_API_CONFIG,
  LazyMapsAPILoaderConfigLiteral,
} from "@agm/core";
import { SharedModule } from "@app/shared/shared.module";
import { environment } from "@env/environment";
import { NgSelectModule } from "@ng-select/ng-select";

import {
  AddEditStoreComponent,
} from "./add-edit-store/add-edit-store.component";
import { StoresComponent } from "./stores.component";
import { ViewStoreComponent } from "./view-store/view-store.component";

const router = [
  { path: "", component: StoresComponent, data: { title: "Stores" } },
];

export function agmConfigFactory(http: HttpClient, config: LazyMapsAPILoaderConfigLiteral) {
  return () => http.get<{GOOGLE_MAP_API_KEY: string}>(`${environment.api}/api/admin/configurations`).pipe(
    map((response:any) => {
        config.apiKey = response.data.GOOGLE_MAP_API_KEY;
        return response;
    })
  ).toPromise();

}
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAGue_n2PIwzqxAaxY0yzd5XgrVcF5hheI',
      libraries: ['places']
    }),
  ],
  declarations: [
    StoresComponent,
    ViewStoreComponent,
    AddEditStoreComponent
  ],
  providers: [ {
    provide: APP_INITIALIZER, 
    useFactory: agmConfigFactory, 
    deps: [HttpClient, LAZY_MAPS_API_CONFIG], 
    multi: true} 
    ],
})
export class StoresModule { }

import { AddEditStoreComponent } from './add-edit-store/add-edit-store.component';
import { ViewStoreComponent } from './view-store/view-store.component';
import { StoresComponent } from './stores.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxPaginationModule } from "ngx-pagination";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AgmCoreModule, LazyMapsAPILoaderConfigLiteral, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

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

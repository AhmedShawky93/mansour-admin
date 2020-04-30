import { RegionsComponent } from "./areas/regions/regions.component";
import { AddEditAreaComponent } from "./areas/add-edit-area/add-edit-area.component";
import { ViewCityComponent } from "./view-city/view-city.component";
import { CitiesComponent } from "./../cities/cities.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddEditCityComponent } from "./add-edit-city/add-edit-city.component";
import { AreasComponent } from "./areas/areas.component";
import { ViewAreaComponent } from "./areas/view-area/view-area.component";
import { AddEditRegionComponent } from "./areas/regions/add-edit-region/add-edit-region.component";
import { ViewRegionComponent } from "./areas/regions/view-region/view-region.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";

const router = [
  { path: "", component: CitiesComponent, data: { title: "Cities" } },
  { path: ":id/areas", component: AreasComponent, data: { title: "Areas" } },
  {
    path: ":id/areas/:id/regions",
    component: RegionsComponent,
    data: { title: "Regions" },
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
  ],
  declarations: [
    CitiesComponent,
    AddEditCityComponent,
    ViewCityComponent,
    AreasComponent,
    AddEditAreaComponent,
    ViewAreaComponent,
    RegionsComponent,
    AddEditRegionComponent,
    ViewRegionComponent,
  ],
})
export class CitiesModule {}

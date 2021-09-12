import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AreasService } from "@app/pages/services/areas.service";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { ToastrService } from "ngx-toastr";
import { ProductsService } from "@app/pages/services/products.service";
declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-cities",
  templateUrl: "./cities.component.html",
  styleUrls: ["./cities.component.css"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d(0px, 0, 0)",
        })
      ),
      state(
        "out",
        style({
          transform: "translate3d(-100%, 0, 0)",
        })
      ),
      transition("in => out", animate("300ms ease-in-out")),
      transition("out => in", animate("300ms ease-in-out")),
    ]),
  ],
})
export class CitiesComponent implements OnInit {
  areas: any;
  cities: any;
  searchTerm: any;
  toggleAddEditData: string = "out";
  viewDataSidebar: string = "out";
  selectDataView: any;
  selectData: any;
  selectFile = null;
  @ViewChild("myInput") importFile: ElementRef;

  constructor(
    private _areaService: AreasService,
    private toastrService: ToastrService,
    private productsService: ProductsService,

  ) {}

  ngOnInit() {
    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    this.getCities();
  }
  viewDataInSidebar(clinic) {
    this.selectDataView = clinic;
    this.toggleAddEditData = "out";
    this.viewDataSidebar = "in";
  }

  toggleMenu(data) {
    this.selectData = data;
    this.viewDataSidebar = "out";
    this.toggleAddEditData = "in";
  }

  closeSideBar() {
    this.toggleAddEditData = "out";
    this.viewDataSidebar = "out";
  }
  getCities() {
    this._areaService.getCities().subscribe((response: any) => {
      if (response.code === 200) {
        this.cities = response.data;
        this.cities.map((data: any) => {
          data.deactivated = !data.active;
          return data;
        });
      }
    });
  }

  addOrUpdateData(data) {
    const index = this.cities.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.cities[index] = data;
    } else {
      this.cities.push(data);
    }
  }

  changeActive(area) {
    this.cities
      .filter((area) => {
        return area.showReason;
      })
      .map((area) => {
        if (area.active == area.deactivated) {
          area.active = !area.active;
        }
        area.showReason = 0;
        return area;
      });

    if (area.active) {
      // currently checked
      area.showReason = 0;
      area.notes = "";
      if (area.deactivated) {
        this._areaService.activateCity(area.id).subscribe((data: any) => {
          area.active = 1;
          area.notes = "";
          area.deactivation_notes = "";
          area.deactivated = 0;
        });
      }
    } else {
      area.notes = area.deactivation_notes;
      area.showReason = 1;
    }
  }

 

  importExcel(event) {
    let fileName = <File>event.target.files[0];
    this.productsService.import(fileName,'9').subscribe((response: any) => {
      console.log(response);
      if(response.code == 200){
        this.toastrService.success('File uploaded successfully')
      }  else{
        this.toastrService.error(response.message);
      }
    });
  }


  cancelDeactivate(area) {
    area.active = 1;
    area.notes = "";
    area.showReason = 0;
  }

  submitDeactivate(area) {
    area.active = 0;
    this._areaService
      .deactivateCity(area.id, { deactivation_notes: area.notes })
      .subscribe((data: any) => {
        area.active = 0;
        area.deactivation_notes = area.notes;
        area.showReason = 0;
        area.deactivated = 1;
      });
  }
}

import { AreasService } from "@app/pages/services/areas.service";
import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-regions",
  templateUrl: "./regions.component.html",
  styleUrls: ["./regions.component.css"],
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
export class RegionsComponent implements OnInit {
  areas: any;
  cities: any;
  searchTerm: any;
  toggleAddEditData: string = "out";
  viewDataSidebar: string = "out";
  selectDataView: any;
  selectData: any;
  idParent: any;
  constructor(
    private _areaService: AreasService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.idParent = params["id"];
      this.getareaById(this.idParent);
    }),
      $(".switch").on("click", ".slider", function () {
        var then = $(this).siblings(".reason-popup").slideToggle(100);
        $(".reason-popup").not(then).slideUp(50);
      });
  }
  viewDataInSidebar(clinic) {
    console.log(clinic);
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
  getareaById(id) {
    this._areaService.getDistrictById(id).subscribe((response: any) => {
      if (response.code === 200) {
        this.cities = response.data;
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
        this._areaService
          .activateDistrict(this.idParent, area.id)
          .subscribe((data: any) => {
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

  cancelDeactivate(area) {
    area.active = 1;
    area.notes = "";
    area.showReason = 0;
  }

  submitDeactivate(area) {
    area.active = 0;
    this._areaService
      .deactivateDistrict(
        this.idParent,
        { deactivation_notes: area.notes },
        area.id
      )
      .subscribe((data: any) => {
        area.active = 0;
        area.deactivation_notes = area.notes;
        area.showReason = 0;
        area.deactivated = 1;
      });
  }
}

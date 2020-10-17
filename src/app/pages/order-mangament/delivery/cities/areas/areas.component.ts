import { AreasService } from "@app/pages/services/areas.service";
import { Component, OnInit } from "@angular/core";
import {Location} from '@angular/common';

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
  selector: "app-areas",
  templateUrl: "./areas.component.html",
  styleUrls: ["./areas.component.css"],
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
export class AreasComponent implements OnInit {
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
    private activeRoute: ActivatedRoute,
    private _location: Location

  ) {}

  ngOnInit() {
    this.activeRoute.params.subscribe((params) => {
      this.idParent = params["id"];
      this.getareaById(this.idParent);
    }),
      $(".open-add").on("click", function () {
        $("#add-area").toggleClass("open-view-vindor-types");
      });

    $(".table").on("click", ".open-edit", function () {
      $("#edit-area").toggleClass("open-view-vindor-types");
    });

    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    // for close only
    $("#close-edit-area").on("click", function () {
      $("#edit-area").removeClass("open-view-vindor-types");
    });

    $("#close-add-area").on("click", function () {
      $("#add-area").removeClass("open-view-vindor-types");
    });

    $(".deliverycharge").niceScroll({
      cursorcolor: "#e4002c",
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
    this._areaService.getAreaById(id).subscribe((response: any) => {
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
        this._areaService
          .activateArea(this.idParent, area.id)
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
      .deactivateArea(
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
  backClicked() {
    this._location.back();
  }
}

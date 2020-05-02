import { OptionsService } from "./../../../services/options.service";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import "rxjs/Rx";
import { Subject } from "rxjs/Rx";
import { tap, delay } from "rxjs/operators";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { DeliveryService } from "@app/pages/services/delivery.service";
declare var $: any;
@Component({
  selector: "app-staff-delivery",
  templateUrl: "./staff-delivery.component.html",
  styleUrls: ["./staff-delivery.component.css"],
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
export class StaffDeliveryComponent implements OnInit {
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  searchTerm;
  selectedUserIds: number[];
  clinics = [];
  q = 1;

  categories: any;
  searchForm: FormGroup;
  total = 0;
  p = 1;
  searchObj = {
    page: 1,
    q: "",
  };
  toggleAddOption: string = "out";
  viewOptionSidebar: string = "out";
  selectOptionData: any;
  selectOptionDataView: any;
  loading: boolean;
  productIsEmpty: boolean;
  options = [];
  deliverers: any;
  constructor(
    private toastrService: ToastrService,
    private deliveryService: DeliveryService
  ) {}

  ngOnInit() {
    this.getDeliverers();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });
  }
  openViewProduct(data) {}

  getDeliverers() {
    this.deliveryService.getDeliverers().subscribe((response: any) => {
      this.deliverers = response.data;

      this.deliverers.map((data: any) => {
        data.deactivated = !data.active;
        return data;
      });
    });
  }

  changePage(p) {
    console.log(p);
    this.searchObj.page = p;
    this.p = p;
    // this.filter.page = p;
    this.getDeliverers();
  }

  changeActive(clinic) {
    this.clinics
      .filter((clinics) => {
        return clinics.showReason;
      })
      .map((clinics) => {
        if (clinics.active == clinics.deactivated) {
          clinics.active = !clinics.active;
        }
        clinics.showReason = 0;
        return clinics;
      });

    if (clinic.active) {
      // currently checked
      clinic.showReason = 0;
      clinic.notes = "";
      if (clinic.deactivated) {
        this.deliveryService.activateDeliverer(clinic.id).subscribe((data: any) => {
          clinic.active = 1;
          clinic.notes = "";
          clinic.deactivation_notes = "";
          clinic.deactivated = 0;
        });
      }
    } else {
      clinic.notes = clinic.deactivation_notes;
      clinic.showReason = 1;
    }
  }

  cancelDeactivate(clinic) {
    clinic.active = 1;
    clinic.notes = "";
    clinic.showReason = 0;
  }
  submitDeactivate(clinic) {
    clinic.active = 0;
    this.deliveryService
      .deactivateDeliverer(clinic.id, { deactivation_notes: clinic.notes })
      .subscribe((data: any) => {
        clinic.active = 0;
        clinic.deactivation_notes = clinic.notes;
        clinic.showReason = 0;
        clinic.deactivated = 1;
      });
  }

  viewClinic(clinic) {
    console.log(clinic);
    this.selectOptionDataView = clinic;
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.selectOptionData = data;
    this.viewOptionSidebar = "out";
    this.toggleAddOption = "in";
    console.log(this.selectOptionData);
  }

  closeSideBar() {
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "out";
  }

  addOrUpdateOption(data) {
    const index = this.options.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.options[index] = data;
    } else {
      this.options.unshift(data);
    }
  }
}

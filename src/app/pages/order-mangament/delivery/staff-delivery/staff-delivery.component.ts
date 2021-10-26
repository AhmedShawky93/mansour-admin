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
import { NgxSpinnerService } from "ngx-spinner";
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
  deliverers: any;
  filter$ = new Subject();
  filter = {
    q: "",
    page: 1,
  };
  constructor(
    private toastrService: ToastrService,
    private deliveryService: DeliveryService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getDeliverers();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });

    this.filter$
      .debounceTime(400)
      .pipe(tap((e) => this.spinner.show()))
      .switchMap((filter) => this.searchDeliverers())
      .subscribe((result: any) => {
        this.deliverers = result.data.deliverers;
        this.deliverers = this.deliverers.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = result.data.total;
        this.spinner.hide();
      });
  }
  openViewProduct(data) {}

  getDeliverers() {
    this.spinner.show();
    this.deliveryService
      .getDeliverers(this.filter)
      .subscribe((response: any) => {
        this.spinner.hide();
        this.deliverers = response.data.deliverers;
        this.deliverers = this.deliverers.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = response.data.total;
      });
  }

  searchDeliverers() {
    return this.deliveryService.getDeliverers(this.filter);
  }

  changePage(p) {
    this.p = p;
    this.filter.page = p;
    this.filter$.next(this.filter);
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
        this.deliveryService
          .activateDeliverer(clinic.id)
          .subscribe((data: any) => {
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
    this.selectOptionDataView = clinic;
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.selectOptionData = data;
    this.viewOptionSidebar = "out";
    this.toggleAddOption = "in";
  }

  closeSideBar() {
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "out";
  }

  addOrUpdateOption(data) {
    const index = this.deliverers.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.deliverers[index] = data;
    } else {
      this.deliverers.unshift(data);
    }
  }
}

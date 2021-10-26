import "rxjs/Rx";

// import { environmentVariables } from '../../../../environments/enviromentalVariables'
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { tap } from "rxjs/operators";
import { Subject } from "rxjs/Rx";

import { SettingService } from "@app/pages/services/setting.service";

import { BracnhesStoreService } from "../../services/stores.service";
import { NgxSpinnerService } from "ngx-spinner";

declare var $: any;
@Component({
  selector: "app-stores",
  templateUrl: "./stores.component.html",
  styleUrls: ["./stores.component.scss"],
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
export class StoresComponent implements OnInit {
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  searchTerm;
  selectedUserIds: number[];
  clinics = [];
  q = 1;
  deleteLoading: boolean = false;
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
  branches = [];
  filter$ = new Subject();
  filter = {
    q: "",
    page: 1,
  };
  removeBranchObj: any;
  environmentVariables;
  constructor(
    private toastrService: ToastrService,
    private bracnhesStoreService: BracnhesStoreService,
    private settingService: SettingService,
    private spinner: NgxSpinnerService
  ) {
    this.getConfig();
  }

  getConfig() {
    this.settingService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }

  ngOnInit() {
    this.getBranches();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });

    this.filter$
      .debounceTime(400)
      .pipe(tap((e) => this.spinner.show()))
      .switchMap((filter) => this.searchBranches())
      .subscribe((result: any) => {
        if (result.code == 200) {
          this.branches = result.data.branches;
          // this.deliverers = this.deliverers.map((item) => {
          //   item.deactivated = !item.active;
          //   return item;
          // });
          this.total = result.data.total;
          this.spinner.hide();
        }
      });
  }

  getBranches() {
    this.spinner.show();
    this.bracnhesStoreService
      .getBranches(this.filter)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response.code == 200) {
          this.branches = response.data.branches;

          // this.deliverers = this.deliverers.map((item) => {
          //   item.deactivated = !item.active;
          //   return item;
          // });
          this.total = response.data.total;
          this.loading = false;
        }
      });
  }

  searchBranches() {
    return this.bracnhesStoreService.getBranches(this.filter);
  }

  removeBranche(data) {
    this.removeBranchObj = data;
    $("#removePopUp").modal("show");
  }

  confirmRemoveBranch() {
    this.deleteLoading = true;
    this.bracnhesStoreService
      .deleteBranch(this.removeBranchObj.id)
      .subscribe((response: any) => {
        if (response.code === 200) {
          const index = this.branches.findIndex(
            (item) => item.id == this.removeBranchObj.id
          );
          this.branches.splice(index, 1);
          this.toastrService.success("Branche is removed");
          $("#removePopUp").modal("hide");
        }
        this.deleteLoading = false;
      });
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
        this.bracnhesStoreService.activate(clinic.id).subscribe((data: any) => {
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
    this.bracnhesStoreService
      .deactivate(clinic.id, { deactivation_notes: clinic.notes })
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
    const index = this.branches.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.branches[index] = data;
    } else {
      this.branches.unshift(data);
    }
  }
}

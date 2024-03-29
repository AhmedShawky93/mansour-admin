import { OptionsService } from "./../../../services/options.service";
import { ToastrService } from "ngx-toastr";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
import { ProductsService } from "@app/pages/services/products.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "environments/environment.prod";
declare var $: any;
@Component({
  selector: "app-clinics",
  templateUrl: "./options.component.html",
  styleUrls: ["./options.component.css"],
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
export class OptionsComponent implements OnInit {
  @ViewChild("myInput") importFile: ElementRef;
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
  // loading: boolean;
  productIsEmpty: boolean;
  options = [];
  deactivateLoading: boolean;
  constructor(
    private toastrService: ToastrService,
    private productsService: ProductsService,
    private optionsService: OptionsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getOptions();

    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });
  }
  openViewProduct(data) {}
  getOptions() {
    this.spinner.show();
    // this.loading = true;
    this.productIsEmpty = false;

    this.optionsService
      .getOptions(this.searchObj)
      .subscribe((response: any) => {
        this.spinner.hide();
        if (response.code === 200) {
          this.options = response.data.options;
          this.total = response.data.total;
          // this.loading = false;
          this.options.map((option) => {
            option.deactivated = !option.active;
            return option;
          });
        }

        // if (response.data.length == 0) {
        //   this.productIsEmpty = true;
        // }
      });
  }

  changePage(p) {
    this.searchObj.page = p;
    this.p = p;
    // this.filter.page = p;
    this.getOptions();
  }

  uploadFile(event) {
    let fileName = <File>event.target.files[0];
    this.productsService.import(fileName, "4").subscribe((response: any) => {
      console.log(response);
      if (response.code == 200) {
        this.toastrService.success("File uploaded successfully");
      } else {
        this.toastrService.error(response.message);
      }
    });
  }
  exportCsv() {
    const exportStock = environment.api + "/api/admin/options/export";

    this.productsService.exportFileStocksPost(exportStock).subscribe({
      next: (rep: any) => {},
    });
    setTimeout(() => {
      this.toastrService.success(
        "You’ll receive a notification when the export is ready for download.",
        " Your export is now being generated ",
        {
          enableHtml: true,
          timeOut: 3000,
        }
      );
    }, 500);
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
        this.optionsService.activate(clinic.id).subscribe((data: any) => {
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
    this.deactivateLoading = true;
    this.optionsService
      .deactivate(clinic.id, { deactivation_notes: clinic.notes })
      .subscribe((data: any) => {
        clinic.active = 0;
        this.deactivateLoading = false;
        clinic.deactivation_notes = clinic.notes;
        clinic.showReason = 0;
        clinic.deactivated = 1;
      });
  }

  viewClinic(clinic) {
    this.scrollToTop();
    this.selectOptionDataView = clinic;
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.scrollToTop();
    this.selectOptionData = data;
    this.viewOptionSidebar = "out";
    this.toggleAddOption = "in";
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

  scrollToTop() {
    const scrollDuration = 200;
    const scrollStep = -window.pageYOffset / (scrollDuration / 20);
    const scrollInterval = setInterval(
      () =>
        window.pageYOffset !== 0
          ? window.scrollBy(0, scrollStep)
          : clearInterval(scrollInterval),
      10
    );
  }
}

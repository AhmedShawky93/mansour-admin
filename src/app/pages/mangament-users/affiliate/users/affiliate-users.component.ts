import "rxjs/Rx";

import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { tap } from "rxjs/operators";
import { Subject } from "rxjs/Rx";

import { AuthService } from "@app/shared/auth.service";
import { environment } from "environments/environment.prod";

import { AffiliateService } from "../../../services/affiliate.service";
import { CustomerService } from "../../../services/customer.service";

declare var $: any;

@Component({
  selector: "app-affiliate-users",
  templateUrl: "./affiliate-users.component.html",
  styleUrls: ["./affiliate-users.component.css"],
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
export class AffiliateUsersComponent implements OnInit {
  dateRange: any;
  showError: number;
  currentProduct: any;
  category_id: any;
  searchTerm;
  selectedUserIds: number[];
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
  toggleAddCustomer: string = "out";
  selectOptionData: any;
  selectOptionDataView: any;
  loading: boolean;
  productIsEmpty: boolean;
  affiliates: any;
  filter$ = new Subject();
  filter = {
    q: "",
    page: 1,
  };
  userData: any;
  selectedAddress: any;
  selectedUserAddress: any;
  userId: any;

  constructor(
    private toastr: ToastrService,
    private affiliateService: AffiliateService,
    private cs: CustomerService,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getAffiliateDetails();
    this.getAffiliatesUser();
    this.searchForm = new FormGroup({
      searchTerm: new FormControl(),
    });

    this.filter$
      .debounceTime(400)
      .pipe(tap((e) => this.spinner.show()))
      .switchMap((filter) => this.searchDeliverers())
      .subscribe((result: any) => {
        this.affiliates = result.data.affiliates;
        this.affiliates = this.affiliates.map((item) => {
          item.deactivated = !item.active;
          return item;
        });
        this.total = result.data.total;
        this.spinner.hide();
      });
  }

  openViewProduct(data) {}

  getAffiliatesUser() {
    this.spinner.show();
    this.affiliateService
      .getUsersAffiliates(this.filter)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.affiliates = response.data.affiliates;
          this.affiliates = this.affiliates.map((item) => {
            item.deactivated = !item.active;
            return item;
          });
          this.total = response.data.total;
          this.showAffiliateDetails();
        } else {
          this.toastr.error(response.message);
        }
        this.spinner.hide();
      });
  }

  getAffiliateDetails() {
    this.userId = this.activatedRoute.snapshot.queryParams.userId;
    if (this.userId) {
      this.filter.q = this.userId;
      this.filter.page = 1;
      this.filter$.next(this.filter);
    }
  }

  showAffiliateDetails() {
    if (this.userId) {
      const affiliate = this.affiliates.find(
        (item) => item.id === Number(this.userId)
      );
      this.viewData(affiliate);
    }
  }

  searchDeliverers() {
    return this.affiliateService.getUsersAffiliates(this.filter);
  }

  changePage(p) {
    this.p = p;
    this.filter.page = p;
    console.log(this.filter);
    this.filter$.next(this.filter);
  }

  changeActive(data) {
    this.affiliates
      .filter((data) => {
        return data.showReason;
      })
      .map((data) => {
        if (data.active == data.deactivated) {
          data.active = !data.active;
        }
        data.showReason = 0;
        return data;
      });

    if (data.active) {
      // currently checked
      data.showReason = 0;
      data.notes = "";
      if (data.deactivated) {
        this.affiliateService.activate(data.id).subscribe((data: any) => {
          data.active = 1;
          data.notes = "";
          data.deactivation_notes = "";
          data.deactivated = 0;
        });
      }
    } else {
      data.notes = data.deactivation_notes;
      data.showReason = 1;
    }
  }

  cancelDeactivate(data) {
    data.active = 1;
    data.notes = "";
    data.showReason = 0;
  }

  submitDeactivate(data) {
    data.active = 0;
    this.affiliateService
      .deactivate(data.id, { deactivation_notes: data.notes })
      .subscribe((rep: any) => {
        if (rep.code === 200) {
          data.active = 0;
          data.showReason = 0;
          data.deactivation_notes = data.notes;
          data.deactivated = 1;
        }
      });
  }

  viewData(data) {
    console.log(data);
    this.selectOptionDataView = data;
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "in";
  }

  toggleMenu(data) {
    this.selectOptionData = data;
    this.viewOptionSidebar = "out";
    this.toggleAddOption = "in";
  }

  closeSideBar(data?) {
    this.toggleAddOption = "out";
    this.viewOptionSidebar = "out";
    if (data != null) {
      this.getAffiliatesUser();
    }
  }

  verifyPhoneUser(data) {
    if (data) {
      this.userData = data;
      $("#verifyPopUp").modal("show");
    }
  }

  verifyPhone(data) {
    this.cs.verifyPhone(data.id).subscribe((response: any) => {
      if (response.code == 200) {
        data.phone_verified = response.data.phone_verified;
        this.selectOptionDataView = data;
        $("#verifyPopUp").modal("hide");
      }
    });
  }

  addOrUpdateAddress(data) {
    this.selectedUserAddress = data;
    data.new_address
      ? (this.selectedAddress = null)
      : (this.selectedAddress = data.select_address);
    $("#addressModal").modal("show");
    this.toggleAddCustomer = "in";
  }

  addOrUpdateCustomer(data) {
    this.selectedUserAddress = null;
    if (data) {
      let ind = this.affiliates.findIndex((c) => c.id == data.id);

      if (ind !== -1) {
        this.affiliates[ind] = data;
      } else {
        this.affiliates.unshift(data);
      }
    }
  }

  addOrUpdateOption(data) {
    const index = this.affiliates.findIndex((item) => item.id == data.id);

    if (index !== -1) {
      this.affiliates[index] = data;
    } else {
      this.affiliates.unshift(data);
    }
  }

  closeAddressModal(data) {
    if (data) {
      if (this.selectedAddress) {
        let ind = this.selectedUserAddress.addresses.findIndex(
          (a) => a.id == this.selectedAddress.id
        );
        if (ind !== -1) {
          this.selectedUserAddress.addresses.splice(ind, 1);
          this.selectedUserAddress.addresses.push(data);
        } else {
          this.selectedUserAddress.addresses.push(data);
        }
      } else {
        this.selectedUserAddress.addresses.push(data);
      }
    }
    this.selectOptionDataView = null;
    this.selectOptionDataView = this.selectedUserAddress;
    this.selectedAddress = null;
    $("#addressModal").modal("hide");
  }

  goToLink() {
    const token = this.auth.getToken();
    const urlBasic =
      environment.api +
      "/api" +
      "/admin/affiliates/affiliates_export?token=" +
      token +
      "&" +
      this.serialize(this.filter);
    this.affiliateService.exportFile(urlBasic).subscribe({
      next: (rep: any) => {
        if (rep.code === 200) {
        }
      },
    });
    setTimeout(() => {
      this.toastr.success(
        "You’ll receive a notification when the export is ready for download.",
        " Your export is now being generated ",
        {
          enableHtml: true,
          timeOut: 3000,
        }
      );
    }, 500);
  }

  serialize(obj) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }
}

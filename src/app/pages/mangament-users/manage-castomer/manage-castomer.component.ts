import { AreasService } from "@app/pages/services/areas.service";
import { Component, OnInit } from "@angular/core";
import { CustomerService } from "@app/pages/services/customer.service";
declare var $: any;
import { environment } from "environments/environment.prod";
import { AuthService } from "@app/shared/auth.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "@app/pages/services/setting.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-manage-castomer",
  templateUrl: "./manage-castomer.component.html",
  styleUrls: ["./manage-castomer.component.css"],
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
export class ManageCastomerComponent implements OnInit {
  show = false;
  hide = true;

  exportUrl;

  searchTerm: any;

  customers: any = [];
  total = 0;

  p = 1;
  filter: any = {
    ids: [],
    name: "",
    email: "",
    phone: "",
    area_id: [],
    city_id: [],
    active: null,
    page: "1",
  };
  customer: any;
  currentPoints: any;
  customerLoading: boolean;
  cities: any;
  areaList: any;
  areaListSearch: any[];
  toggleAddCustomer = "out";
  selectedCustomer: any;
  selectedAddress: any;
  customerId: any;
  environmentVariables;
  syncLoad = false;
  constructor(
    private customerService: CustomerService,
    private auth: AuthService,
    private _areaService: AreasService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
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
    this.getCities();
    this.customerId = Number(this.activatedRoute.snapshot.queryParams.id);

    $(".table").on("click", ".toggle-vindor-view", function () {
      $("#view-active").toggleClass("open-view-vindor-types");
    });

    $(".toggle-view-active").on("click", function () {
      $("#view-active").toggleClass("open-view-vindor-types");
    });

    $(".switch").on("click", ".slider", function () {
      const then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });

    // for close only
    $("#close-vindors4").on("click", function () {
      $("#view-deactive").removeClass("open-view-vindor-types");
    });

    $("#close-vindors1").on("click", function () {
      $("#view-active").removeClass("open-view-vindor-types");
    });

    const token = this.auth.getToken();
    this.exportUrl =
      environment.api + "/api" + "/admin/customers/export?token=" + token;

    this.searchInCustomers();
    if (this.activatedRoute.snapshot.queryParams.fromOrder) {
      this.createCustomer();
    }

    if (
      this.activatedRoute.snapshot.queryParams.fromOrderCreateAddress &&
      this.activatedRoute.snapshot.queryParams.customerId
    ) {
      let customer = JSON.parse(localStorage.getItem("selectedCustomer"));
      this.createAddress(customer);
    }
  }

  getCities() {
    this._areaService.getCities().subscribe((response: any) => {
      if (response.code === 200) {
        this.cities = response.data;
      }
    });
  }

  exportCustomers() {
    this.customerService.exportCustomers(this.exportUrl).subscribe({
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

  selectCity(cityId) {
    if (cityId) {
      this.filter.city_id = [];
      this.filter.area_id = [];

      const index = this.cities.findIndex((item) => item.id == cityId);
      if (index !== -1) {
        if (this.cities[index].areas.length) {
          this.areaListSearch = this.cities[index].areas;
        } else {
          this.areaListSearch = [];
          this.areaListSearch.push(this.cities[index]);
        }
      }

      this.filter.city_id = cityId;
    } else {
      this.filter.city_id = [];
      this.areaListSearch = [];
    }
    this.searchInCustomers();
  }

  selectArea(areaId) {
    this.filter.area_id = areaId;
    this.searchInCustomers();
  }

  toggleShow() {
    this.show = !this.show;
    this.hide = !this.hide;
  }

  changePage(p) {
    this.p = p;
    this.filter.page = this.p;
    this.searchInCustomers();
  }
  syncCustomers() {
    this.syncLoad = true;
    this.customerService.syncCustomer().subscribe((res: any) => {
      this.syncLoad = false;
      if (res.code == 200) {
        this.toastrService.success(res.message);
        this.searchInCustomers();
      } else this.toastrService.error(res.message);
    });
  }
  searchInCustomers() {
    this.filter.page = this.p;
    this.filter.ids = this.customerId ? [this.customerId] : [];
    this.spinner.show();
    this.customerService
      .getCustomers(this.filter)
      .subscribe((response: any) => {
        this.customers = response.data.customers;
        this.spinner.hide();
        this.customers.map((user) => {
          user.age = this.calculateAge(new Date(user.birthdate));
          user.deactivated = !user.active;
          return user;
        });
        this.total = response.data.total;
      });
  }

  viewCustomer(customer) {
    this.customerLoading = true;
    this.customer = null;
    this.customerService.getCustomer(customer.id).subscribe((response: any) => {
      this.customer = { ...response.data };
      this.customerLoading = false;
    });
  }

  calculateAge(birthday) {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  changeActive(user) {
    this.customers
      .filter((user) => {
        return user.showReason;
      })
      .map((user) => {
        if (user.active === user.deactivated) {
          user.active = !user.active;
        }
        user.showReason = 0;
        return user;
      });

    if (user.active) {
      // currently checked
      user.showReason = 0;
      user.notes = "";
      if (user.deactivated) {
        this.customerService
          .activateCustomer(user.id)
          .subscribe((data: any) => {
            user.active = 1;
            user.deactivated = 0;
          });
      }
    } else {
      user.notes = user.deactivation_notes;
      user.showReason = 1;
    }
  }

  confirmCancelPoints(point) {
    this.currentPoints = point;
  }

  cancelPoints() {
    this.customerService
      .cancelPoints(this.currentPoints.id)
      .subscribe((response: any) => {
        this.currentPoints = response.data;
        const ind = this.customer.points.findIndex(
          (p) => p.id == this.currentPoints.id
        );
        if (ind !== -1) {
          this.customer.points[ind] = this.currentPoints;
        }
      });
  }

  confirmVerifyPhone(customer) {
    this.customer = customer;
  }

  verifyPhone() {
    this.customerService
      .verifyPhone(this.customer.id)
      .subscribe((response: any) => {
        if (response.code == 200) {
          this.customer.phone_verified = response.data.phone_verified;
        }
      });
  }

  loginAsCustomer(id) {
    this.customerService.getCustomerToken(id).subscribe((response: any) => {
      const token = response.data;
      window.open(
        `${this.environmentVariables.brandRelatedVariables.loginApi}/session/signin?disabled_guard=true&token=${token}`,
        "_blank"
      );
    });
  }

  cancelDeactivate(user) {
    user.active = 1;
    user.notes = "";
    user.showReason = 0;
  }

  activateUser(user) {
    this.customerService.activateCustomer(user.id).subscribe((data: any) => {
      user.active = 1;
      user.deactivated = 0;

      const ind = this.customers.findIndex(
        (customer: any) => customer.id === user.id
      );
      if (ind !== -1) {
        this.customers[ind].active = 1;
        this.customers[ind].deactivated = 0;
      }
    });
  }

  submitDeactivate(user) {
    user.active = 0;
    this.customerService
      .deactivateCustomer(user.id, { deactivation_notes: user.notes })
      .subscribe((data: any) => {
        user.active = 0;
        user.deactivation_notes = user.notes;
        user.showReason = 0;
        user.deactivated = 1;
      });
  }

  editCustomer(customer) {
    this.selectedCustomer = customer;

    this.toggleAddCustomer = "in";
  }

  createCustomer() {
    this.selectedCustomer = null;
    this.toggleAddCustomer = "in";
  }

  closeSideBar(data = null) {
    this.selectedCustomer = null;
    $("#view-deactive").removeClass("open-view-vindor-types");
    $("#view-side-bar-return-order").removeClass("open-view-vindor-types");
    this.toggleAddCustomer = "out";
    if (data) {
      this.changePage(this.p);
    }
  }

  addOrUpdateCustomer(data) {
    this.selectedCustomer = null;
    if (data) {
      const ind = this.customers.findIndex((c) => c.id == data.id);

      if (ind !== -1) {
        this.customers[ind] = data;
      } else {
        this.customers.unshift(data);
      }
    }
  }

  createAddress(customer) {
    this.selectedCustomer = customer;
    this.selectedAddress = null;
    $("#addressModal").modal("show");
  }

  editAddress(customer, address) {
    this.selectedCustomer = customer;
    this.selectedAddress = address;
    $("#addressModal").modal("show");
  }

  closeAddressModal(data) {
    if (data) {
      if (this.selectedAddress) {
        const ind = this.customer.addresses.findIndex(
          (a) => a.id == this.selectedAddress.id
        );
        if (ind !== -1) {
          this.customer.addresses.splice(ind, 1);
          this.customer.addresses.push(data);
        }
      } else {
        this.customer.addresses.push(data);
      }
    }

    this.selectedAddress = null;
    $("#addressModal").modal("hide");
  }
}

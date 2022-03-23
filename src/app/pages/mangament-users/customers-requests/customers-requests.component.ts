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
  selector: "app-customers-requests",
  templateUrl: "./customers-requests.component.html",
  styleUrls: ["./customers-requests.component.css"],
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
export class ManageRequestsComponent implements OnInit {
  show = false;
  hide = true;

  exportUrl;

  searchTerm: any;

  requests: any = [];
  total = 0;

  p = 1;
  filter: any = {
    page: 1,
  };
  customer: any;
  currentrequest: any;
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
  statedeleting: boolean;
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

    this.getRequests();

    if (
      this.activatedRoute.snapshot.queryParams.fromOrderCreateAddress &&
      this.activatedRoute.snapshot.queryParams.customerId
    ) {
      let customer = JSON.parse(localStorage.getItem("selectedCustomer"));
    }
  }

  changePage(p) {
    this.p = p;
    this.filter.page = this.p;
    this.getRequests();
  }
  getRequests() {
    this.customerService
      .getRequests(this.filter.page)
      .subscribe((response: any) => {
        this.requests = response?.data?.data;
        this.spinner.hide();
        this.total = response.data.total;
      });
  }

  deleteRequest(request) {
    this.currentrequest = request;
    $("#deleteProduct").modal("show");
  }
  confirmDelete() {
    this.statedeleting = true;
    this.customerService
      .softDeleteRequest(this.currentrequest.id)
      .subscribe((response: any) => {
        if (response.code === 200) {
          this.statedeleting = false;
          this.toastrService.success(
            "Request deleted Successfully",
            "Success",
            {
              enableHtml: true,
              timeOut: 3000,
            }
          );
          this.currentrequest["delete"] = true;
          this.addOrUpdateRequest(this.currentrequest);
          $("#deleteProduct").modal("hide");
        } else {
          this.statedeleting = false;
          this.toastrService.error(response.message, "Error Occured", {
            enableHtml: true,
            timeOut: 3000,
          });
        }
      });
  }
  addOrUpdateRequest(data) {
    const index = this.requests.findIndex((item) => item.id == data.id);
    if (index !== -1 && !data["delete"]) {
      this.requests[index] = data;
    } else if (index !== -1 && data["delete"]) {
      this.requests.splice(index, 1);
    } else {
      this.requests.unshift(data);
    }
  }
}

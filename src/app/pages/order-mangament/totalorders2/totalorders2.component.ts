import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DeliveryService } from "@app/pages/services/delivery.service";
import { AuthService } from "@app/shared/auth.service";
import { environment } from "environments/environment.prod";
import { CustomerService } from "@app/pages/services/customer.service";
declare var jquery: any;
declare var $: any;
@Component({
  selector: "app-total",
  templateUrl: "./totalorders2.component.html",
  styleUrls: ["./totalorders2.component.css"],
})
export class TotalComponent implements OnInit {
  currentCustomer: any;
  exportUrl: string;
  currentOrder: any;
  show = false;
  hide = true;
  orders = [];
  searchTerm: any;
  p = 1;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private deliverService: DeliveryService,
    private auth: AuthService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    let token = this.auth.getToken();

    $(".toggle-vindor-view").on("click", function () {
      $("#view-deactive").toggleClass("open-view-vindor-types");
      // $(".left-sidebar").toggleClass("toggle-left-sidebar")
      // $("i", this).toggleClass(" icon-Exit fa fa-bars");
    });

    $("#close-vindors4").on("click", function () {
      $("#view-deactive").removeClass("open-view-vindor-types");
    });

    this.activeRoute.params.subscribe((params) => {
      let id = params["id"];
      this.exportUrl =
        environment.api +
        "/api" +
        "/admin/deliverers/" +
        id +
        "/exportOrders?token=" +
        token;
      this.deliverService.getDelivererOrders(id).subscribe((response: any) => {
        this.orders = response.data;
      });
    });
  }

  viewCustomer(customer) {
    $("#view-deactive").toggleClass("open-view-vindor-types");

    this.customerService.getCustomer(customer.id).subscribe((response: any) => {
      this.currentCustomer = response.data;
    });
  }

  toggleShow() {
    this.show = !this.show;
    this.hide = !this.hide;
  }
}

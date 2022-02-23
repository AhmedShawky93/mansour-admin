import { Component, OnInit } from "@angular/core";
import { OrdersService } from "@app/pages/services/orders.service";
import { Title } from "@angular/platform-browser";
import { trigger, transition, animate, style } from "@angular/animations";
import { SettingService } from "@app/pages/services/setting.service";
import { NgxSpinnerService } from "ngx-spinner";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  animations: [
    trigger("fade", [
      transition("void => *", [
        style({ transform: "translateY(20px)" }),

        animate(2000, style({ transform: "translateY(0)" })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  customersCount: any = 0;
  ordersCount: any = 0;
  productsCount: any = 0;

  orders: any = [];
  total = 0;
  p = 1;

  availableDeliverers = [];

  viewFilter;
  listFilter;
  smsCount: any;
  environmentVariables: any;

  constructor(
    private ordersService: OrdersService,
    private titleService: Title,
    private settingsService: SettingService,
    private spinner: NgxSpinnerService
  ) {
    this.titleService.setTitle("Dashboard");
  }

  getConfig() {
    this.settingsService.getenvConfig().subscribe((res) => {
      this.environmentVariables = res;
    });
  }

  ngOnInit() {
    this.getConfig();
    $(".tb-assign .btn").on("click", function () {
      $("#delevary1").slideToggle();
    });

    $("#delevary1 .close").on("click", function () {
      $("#delevary1").slideUp();
    });
    this.spinner.show("tableSpinner");
    this.ordersService.getUnassignedOrders().subscribe((response: any) => {
      this.spinner.hide("tableSpinner");
      this.orders = response.data;
      this.total = this.orders?.length;
    });
    setTimeout(() => {
      this.spinner.show("staticDataSpinner"); // sp1, sp2, sp3
    }, 0);
    this.settingsService.getStatistics().subscribe((response: any) => {
      this.spinner.hide("staticDataSpinner");
      this.productsCount = response.data.products;
      this.ordersCount = response.data.orders;
      this.customersCount = response.data.customers;
      this.smsCount = response.data.smsCredit;
    });
  }

  getDeliverers(order: any) {
    // load available
    this.orders.map((item) => (item.showPopup = 0));
    this.ordersService
      .getAvailableDeliverers(order.id)
      .subscribe((response: any) => {
        this.availableDeliverers = response.data;
        this.viewFilter = "";
        this.listFilter = "";
      });

    // order.showPopup = !order.showPopup;
  }

  selectDeliverer(selectedUser) {
    this.availableDeliverers.map((user) => {
      if (user.id === selectedUser.id) {
        user.selected = 1;
      } else {
        user.selected = 0;
      }
      return user;
    });
  }

  assignDeliverer(order) {
    const deliverer = this.availableDeliverers.filter((user) => user.selected);

    if (!deliverer.length) {
      return;
    }

    this.ordersService
      .assignDeliverer(order.id, { deliverer_id: deliverer[0].id })
      .subscribe((response: any) => {
        if (response.code === 200) {
          const ind = this.orders.findIndex((item) => item.id === order.id);

          this.orders.splice(ind, 1);
          this.total--;
        }
      });
  }
}

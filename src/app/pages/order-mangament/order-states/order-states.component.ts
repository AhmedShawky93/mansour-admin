import { OrderStatesService } from "./../../services/order-states.service";
import { AdminsService } from "../../services/admins.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from "@angular/animations";
import { NgxSpinnerService } from "ngx-spinner";
declare var $: any;

@Component({
  selector: "app-order-states",
  templateUrl: "./order-states.component.html",
  styleUrls: ["./order-states.component.css"],
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
export class OrderStatesComponent implements OnInit {
  admins = [];
  searchTerm: "";
  orderStatus: any;
  toggleAddEditData: string = "out";
  viewDataSidebar: string = "out";
  selectData: any;
  selectDataView: any;
  sub_states = [];
  constructor(
    private adminService: AdminsService,
    private toastrService: ToastrService,
    private orderStatesService: OrderStatesService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    $(".switch").on("click", ".slider", function () {
      var then = $(this).siblings(".reason-popup").slideToggle(100);
      $(".reason-popup").not(then).slideUp(50);
    });
    this.getOrderStates();
  }

  getOrderStates() {
    this.spinner.show();
    this.orderStatesService.getOrderStatus().subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response.code === 200) {
          this.orderStatus = response.data;
        }
      },
    });
  }

  viewData(data) {
    this.selectDataView = data;
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

  addOrUpdateOption(data) {
    const index = this.orderStatus.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.orderStatus[index] = data;
    }
  }

  addOrUpdateData(data) {
    const index = this.orderStatus.findIndex((item) => item.id == data.id);
    if (index !== -1) {
      this.orderStatus[index] = data;
    }
  }
}
